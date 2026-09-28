export const useImageCompress = () => {
  /**
   * Mengkompresi file gambar di sisi klien sebelum diupload
   * @param file File gambar yang akan dikompresi
   * @param maxWidth Lebar maksimum gambar setelah dikompresi
   * @param quality Kualitas kompresi JPEG (0.0 - 1.0)
   * @returns Promise<File> File hasil kompresi
   */
  const compressImageFile = (file: File, maxWidth = 800, quality = 0.6): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = event => {
        const img = new Image()
        img.src = event.target?.result as string
        img.onload = () => {
          let width = img.width
          let height = img.height
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          }
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          if (!ctx) return reject(new Error('Canvas context failed'))
          
          ctx.drawImage(img, 0, 0, width, height)
          
          canvas.toBlob((blob) => {
            if (!blob) return reject(new Error('Canvas to Blob failed'))
            const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", { type: 'image/jpeg' })
            resolve(newFile)
          }, 'image/jpeg', quality)
        }
        img.onerror = error => reject(error)
      }
      reader.onerror = error => reject(error)
    })
  }

  return {
    compressImageFile
  }
}
