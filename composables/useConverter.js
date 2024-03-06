import { ref } from "vue";
export const useConverter = () => {
  async function convertCanvas(element) {
    
  }
  function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[arr.length - 1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], { type: mime });
  }

  return {
    convertCanvas,
    dataURLtoBlob,
  };
};
