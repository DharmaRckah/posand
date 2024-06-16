import express from 'express'
import upload from '../middleware/uploadMiddleware.js'

const router = express.Router()

// Endpoint to handle image upload
router.post('/upload-image', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.status(200).json({ imagePath: req.file.path });
  });
});

export default router