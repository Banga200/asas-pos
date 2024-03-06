export default function () {
  const {errorhandle} = useSnackBar()
    function handelError(error) {
        console.log(error)
        if(error) {
            
            const statusCode = error.Code;
            if (statusCode === 404) {
              console.log('لم يجد المصادر 404');
            } else if (statusCode === 429) {
              console.log('طلبات على الخادم كثيرة, الرجاء المحاولة لاحقا');
            } else if (statusCode === 401) {
              errorhandle(error.Message);
            }
            else if (statusCode === 400) {
              errorhandle(error.Message);
              }
            else if (statusCode >= 500) {
              console.log('خطا في الخادم: حدث خطا داخلي في الخادم');
            } else if (error.message === 'Network Error') {
              console.log('لا يوجد انترنت: الرجاء المحاولة لاحقا');
            }
          } 
          else if (error.request) {
            // The request was made, but no response was received
            console.log('لايوجد رد من الخادم');
          }
          else {
            // A different error occurred here
            console.log('حدث خطا غير متوقع, الرجاء المحاولة لاحقا');
            console.log(error)
          }
        } 
    
        return { handelError}
}