export const optimizeImage = (url, width = 1920) => {
  if (!url) return '';
  if (url.includes('cloudinary.com')) {
    // If the URL already has some transformations, we might want to be careful, 
    // but typically standard urls from uploads look like:
    // https://res.cloudinary.com/demo/image/upload/v12345/sample.jpg
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      // q_auto:best retains extremely high quality but compresses better than raw uploads
      // f_auto automatically converts to WebP/AVIF for modern browsers (huge size reduction)
      // w_${width} prevents loading unnecessarily massive 4000x4000px images on screens that don't need them
      // c_limit ensures we only scale down if the image is wider than `width`, never scale up.
      return `${parts[0]}/upload/f_auto,q_auto:best,w_${width},c_limit/${parts[1]}`;
    }
  }
  return url;
};

export const getMobileImage = (url) => {
  return optimizeImage(url, 800);
};

export const getThumbnail = (url) => {
  return optimizeImage(url, 600);
};
