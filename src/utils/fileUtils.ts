
export const downloadFile = (fileData: string, fileName: string, fileType?: string) => {
  try {
    // Base64 데이터에서 실제 데이터 부분만 추출
    const base64Data = fileData.split(',')[1] || fileData;
    
    // Base64를 바이너리로 변환
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: fileType || 'application/octet-stream' });
    
    // 다운로드 링크 생성
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    
    // 다운로드 실행
    document.body.appendChild(link);
    link.click();
    
    // 정리
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('파일 다운로드 실패:', error);
    throw new Error('파일을 다운로드할 수 없습니다.');
  }
};

export const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop()?.toLowerCase() || '';
};

export const getFileIcon = (fileName: string) => {
  const extension = getFileExtension(fileName);
  
  switch (extension) {
    case 'pdf':
      return 'file-text';
    case 'doc':
    case 'docx':
      return 'file-text';
    case 'txt':
      return 'file-text';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return 'file-image';
    case 'mp4':
    case 'avi':
    case 'mov':
      return 'file-video';
    default:
      return 'file';
  }
};
