import { ElMessage, ElMessageBox ,ElNotification  } from 'element-plus'
/*
  错误提示拦截处理
  错误提示：包含model、messsage、notification三种展示方式
  typeModel: alert、message、notification
 */
export const tipMessage = ({ typeModel, type, title, message, customClass, showClose, duration }) => {
  if (typeModel) {
    switch (typeModel) {
      case 'alert':
        ElMessageBox.alert((message || ''), (title || '提示'), {
          confirmButtonText: '确定',
          type: type || 'warning',
          customClass: customClass ? `${customClass} message-box-dialogs` : 'message-box-dialogs'
        });
        break
      case 'message':
        ElMessage({
          customClass: customClass || '',
          showClose: showClose || true,
          type: type || 'info',
          duration: duration || 3000,
          message: message || ''
        });
        break
      case 'notification':
        ElNotification({
          customClass: customClass,
          showClose: showClose || true,
          duration: duration || 3000,
          type: type || 'info',
          message: message || ''
        });
        break
    }
  } else {
    ElMessage({
      customClass: customClass || '',
      showClose: showClose || true,
      type: type || 'info',
      duration: duration || 3000,
      message: message || ''
    });
  }
}
