export const uploadCropImage = (pic, uploadImage, size) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = pic.viewBoxImage;
    const scaleX = image.naturalWidth / pic.imageData.width;
    const scaleY = image.naturalHeight / pic.imageData.height;
    const width = size;
    const height = size;
    canvas.width = width < pic.cropBoxData.width * scaleX ? width : pic.cropBoxData.width * scaleX;
    canvas.height = height < pic.cropBoxData.height * scaleY ? height : pic.cropBoxData.height * scaleY;
    ctx.drawImage(
      image,
      pic.imageData.width < pic.containerData.width ? (pic.cropBoxData.left - (pic.containerData.width - pic.cropBoxData.maxWidth) / 2) * scaleX : pic.cropBoxData.left * scaleX,
      pic.cropBoxData.top * scaleY,
      pic.cropBoxData.width * scaleX,
      pic.cropBoxData.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const reader = new FileReader();
    canvas.toBlob((blob) => {reader.readAsDataURL(blob);});
    let croppedImage = null;
    reader.onloadend = () => {
      let arr = reader.result.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), 
          n = bstr.length, 
          u8arr = new Uint8Array(n);
              
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      croppedImage = new File([u8arr], "profile.png", {type:mime});
      uploadImage(croppedImage);
    };
}