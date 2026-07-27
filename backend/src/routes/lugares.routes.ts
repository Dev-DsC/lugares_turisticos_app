import { Router } from 'express';
import { LugarModel } from '../models/lugar.model';
import mongoose from 'mongoose';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', async (_request, response) => {
  try {
    const lugares = await LugarModel.find().sort({ nombre: 1 });

    response.json(lugares);
  } catch (error) {
    response.status(500).json({
      mensaje: 'No fue posible obtener los lugares',
    });
  }
});

router.get('/:id', async (request, response) => {
  const id = String(request.params.id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      mensaje: 'El id del lugar no es válido',
    });
  }

  try {
    const lugar = await LugarModel.findById(id).populate(
      'comentarios.autor',
      'email',
    );

    if (!lugar) {
      return response.status(404).json({
        mensaje: 'Lugar no encontrado',
      });
    }

    return response.json(lugar);
  } catch (error) {
    return response.status(500).json({
      mensaje: 'No fue posible obtener el lugar',
    });
  }
});

router.post('/', authMiddleware, async (request, response) => {
  const { nombre, imagen } = request.body;
  const userId = (request as any).userId;
  const userRole = (request as any).userRole as 'user' | 'admin' | undefined;

  if (
    typeof nombre !== 'string' ||
    !nombre.trim() ||
    typeof imagen !== 'string' ||
    !imagen.trim()
  ) {
    return response.status(400).json({
      mensaje: 'El nombre y la imagen son obligatorios',
    });
  }

  try {
    // Sólo administradores pueden crear lugares
    if (userRole !== 'admin') {
      return response
        .status(403)
        .json({ mensaje: 'No autorizado para crear lugares' });
    }

    const nuevoLugar = await LugarModel.create({
      nombre,
      imagen,
      comentarios: [],
      autor: userId,
    });

    return response.status(201).json(nuevoLugar);
  } catch (error) {
    return response.status(500).json({
      mensaje: 'No fue posible crear el lugar',
    });
  }
});

router.put('/:id', authMiddleware, async (request, response) => {
  const id = String(request.params['id']);
  const { nombre, imagen } = request.body;
  const userId = (request as any).userId;
  const userRole = (request as any).userRole as 'user' | 'admin' | undefined;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      mensaje: 'El id del lugar no es válido',
    });
  }

  if (
    typeof nombre !== 'string' ||
    !nombre.trim() ||
    typeof imagen !== 'string' ||
    !imagen.trim()
  ) {
    return response.status(400).json({
      mensaje: 'El nombre y la imagen son obligatorios',
    });
  }

  try {
    const lugar = await LugarModel.findById(id);

    if (!lugar) {
      return response.status(404).json({ mensaje: 'Lugar no encontrado' });
    }

    // allow if owner or admin
    if (
      !(lugar.autor && lugar.autor.toString() === userId) &&
      userRole !== 'admin'
    ) {
      return response
        .status(403)
        .json({ mensaje: 'No autorizado para modificar este lugar' });
    }

    lugar.nombre = nombre;
    lugar.imagen = imagen;
    await lugar.save();

    const lugarActualizado = lugar;

    if (!lugarActualizado) {
      return response.status(404).json({
        mensaje: 'Lugar no encontrado',
      });
    }

    return response.json(lugarActualizado);
  } catch (error) {
    return response.status(500).json({
      mensaje: 'No fue posible modificar el lugar',
    });
  }
});

router.delete('/:id', authMiddleware, async (request, response) => {
  const id = String(request.params['id']);
  const userId = (request as any).userId;
  const userRole = (request as any).userRole as 'user' | 'admin' | undefined;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      mensaje: 'El id del lugar no es válido',
    });
  }

  try {
    const lugar = await LugarModel.findById(id);

    if (!lugar) {
      return response.status(404).json({ mensaje: 'Lugar no encontrado' });
    }

    // allow delete if owner or admin
    if (
      !(lugar.autor && lugar.autor.toString() === userId) &&
      userRole !== 'admin'
    ) {
      return response
        .status(403)
        .json({ mensaje: 'No autorizado para eliminar este lugar' });
    }

    const lugarEliminado = await LugarModel.findByIdAndDelete(id);

    return response.json({
      mensaje: 'Lugar eliminado correctamente',
      lugar: lugarEliminado,
    });
  } catch (error) {
    return response.status(500).json({
      mensaje: 'No fue posible eliminar el lugar',
    });
  }
});

//Comentarios API (sólo usuarios autenticados pueden comentar)
router.post('/:id/comentarios', authMiddleware, async (request, response) => {
  const id = String(request.params['id']);
  const { texto } = request.body;
  const userId = (request as any).userId;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      mensaje: 'El id del lugar no es válido',
    });
  }

  if (typeof texto !== 'string' || !texto.trim()) {
    return response.status(400).json({
      mensaje: 'El comentario no puede estar vacío',
    });
  }

  try {
    const lugar = await LugarModel.findById(id);

    if (!lugar) {
      return response.status(404).json({
        mensaje: 'Lugar no encontrado',
      });
    }

    lugar.comentarios.push({
      texto,
      fechaCreacion: new Date(),
      autor: userId,
    });

    await lugar.save();
    await lugar.populate('comentarios.autor', 'email');

    return response.status(201).json(lugar);
  } catch (error) {
    return response.status(500).json({
      mensaje: 'No fue posible agregar el comentario',
    });
  }
});

router.put(
  '/:id/comentarios/:comentarioId',
  authMiddleware,
  async (request, response) => {
    const id = String(request.params['id']);
    const comentarioId = String(request.params['comentarioId']);
    const { texto } = request.body;
    const userId = (request as any).userId;
    const userRole = (request as any).userRole as 'user' | 'admin' | undefined;

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(comentarioId)
    ) {
      return response.status(400).json({
        mensaje: 'El id del lugar o del comentario no es válido',
      });
    }

    if (typeof texto !== 'string' || !texto.trim()) {
      return response.status(400).json({
        mensaje: 'El comentario no puede estar vacío',
      });
    }

    try {
      const lugar = await LugarModel.findById(id);

      if (!lugar) {
        return response.status(404).json({
          mensaje: 'Lugar no encontrado',
        });
      }

      const comentario = (lugar.comentarios as any).find(
        (c: any) => c._id?.toString() === comentarioId,
      );

      if (!comentario) {
        return response.status(404).json({
          mensaje: 'Comentario no encontrado',
        });
      }

      if (
        !(comentario.autor && comentario.autor.toString() === userId) &&
        userRole !== 'admin'
      ) {
        return response
          .status(403)
          .json({ mensaje: 'No autorizado para modificar este comentario' });
      }

      comentario.texto = texto;
      await lugar.save();
      await lugar.populate('comentarios.autor', 'email');

      return response.json(lugar);
    } catch (error) {
      return response.status(500).json({
        mensaje: 'No fue posible modificar el comentario',
      });
    }
  },
);

router.delete(
  '/:id/comentarios/:comentarioId',
  authMiddleware,
  async (request, response) => {
    const id = String(request.params['id']);
    const comentarioId = String(request.params['comentarioId']);
    const userId = (request as any).userId;
    const userRole = (request as any).userRole as 'user' | 'admin' | undefined;

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(comentarioId)
    ) {
      return response.status(400).json({
        mensaje: 'El id del lugar o del comentario no es válido',
      });
    }

    try {
      const lugar = await LugarModel.findById(id);

      if (!lugar) {
        return response.status(404).json({
          mensaje: 'Lugar no encontrado',
        });
      }

      const comentario = (lugar.comentarios as any).find(
        (c: any) => c._id?.toString() === comentarioId,
      );

      if (!comentario) {
        return response.status(404).json({
          mensaje: 'Comentario no encontrado',
        });
      }

      if (
        !(comentario.autor && comentario.autor.toString() === userId) &&
        userRole !== 'admin'
      ) {
        return response
          .status(403)
          .json({ mensaje: 'No autorizado para eliminar este comentario' });
      }

      lugar.comentarios = (lugar.comentarios as any).filter(
        (c: any) => c._id?.toString() !== comentarioId,
      );
      await lugar.save();
      await lugar.populate('comentarios.autor', 'email');

      return response.json(lugar);
    } catch (error) {
      return response.status(500).json({
        mensaje: 'No fue posible eliminar el comentario',
      });
    }
  },
);

export default router;
