import multer from 'multer'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    const suffix = Math.round(Math.random() * 1e9)

    cb(null, suffix + '-' + file.originalname)
  },
})

export const upload = multer({ storage })
