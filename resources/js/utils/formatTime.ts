function formatTime(datetime: string): string {
    const fixedDatetime = datetime.replace(/([+-]\d{2})(\d{2})$/, '$1:$2');
  
      const date = new Date(fixedDatetime);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
  
      return `${hours}:${minutes}`;
}

export default formatTime