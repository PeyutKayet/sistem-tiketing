export const useImageCompress = () => {
  /**
   * Mengkompresi file gambar di sisi klien sebelum diupload
   * @param file File gambar yang akan dikompresi
   * @param maxWidth Lebar maksimum gambar setelah dikompresi (default 1080px)
   * @param quality Kualitas kompresi (0.0 - 1.0, default 0.82)
   * @param preferredFormat 'image/webp' | 'image/jpeg' (default: 'image/webp' dengan fallback jpeg)
   * @returns Promise<File> File hasil kompresi
   */
  const compressImageFile = (
    file: File, 
    maxWidth = 1080, 
    quality = 0.82,
    preferredFormat: 'image/webp' | 'image/jpeg' = 'image/webp'
  ): Promise<File> => {
    return new Promise((resolve, reject) => {
      // Jika bukan gambar, kembalikan file asli tanpa perubahan
      if (!file.type || !file.type.startsWith('image/')) {
        return resolve(file)
      }

      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = event => {
        const img = new Image()
        img.src = event.target?.result as string
        img.onload = () => {
          let width = img.width
          let height = img.height

          // Skalakan dimensi dengan menjaga aspek rasio
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          }

          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          if (!ctx) return reject(new Error('Canvas context failed'))
          
          // Kualitas gambar maksimal saat scaling
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          ctx.drawImage(img, 0, 0, width, height)
          
          // Cek dukungan WebP pada browser
          let format = preferredFormat
          const isWebpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
          if (format === 'image/webp' && !isWebpSupported) {
            format = 'image/jpeg'
          }

          const extension = format === 'image/webp' ? '.webp' : '.jpg'
          const baseName = file.name.replace(/\.[^/.]+$/, "")
          const newFileName = `${baseName}${extension}`

          canvas.toBlob((blob) => {
            if (!blob) return reject(new Error('Canvas to Blob failed'))
            const newFile = new File([blob], newFileName, { type: format })
            resolve(newFile)
          }, format, quality)
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

