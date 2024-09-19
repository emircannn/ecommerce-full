import moment from 'moment';

  export function calculateDiscountPercentage(price: number | null, special: number | null): number | null {
    if (!price || !special) {
        return null;
    }

    const discount = ((price - special) / price) * 100;
    return Math.round(discount); // İndirimi tam sayıya yuvarlar
}

export function priceMasking(price: number): string {
  return price.toLocaleString('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
  });
}

export function formatDateWithDayInTurkish(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long',   
    day: 'numeric'    
  };
  
  return new Intl.DateTimeFormat('tr-TR', options).format(date);
}

export const onlyDate = (date: Date | string | number) => {
  const trDateFormat = 'DD.MM.YYYY';
  moment.locale('tr'); 
  return moment(date).format(trDateFormat);
}

export const dateFormater = (date: Date) => {
  const turkishDateFormat = 'DD.MM.YYYY HH:mm';
  moment.locale('tr'); 
  return moment(date).format(turkishDateFormat);
}

export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',   
    year: 'numeric',   
    month: 'long',   
    day: 'numeric',   
    hour: '2-digit',   
    minute: '2-digit'  
  };
  
  const formattedDate = new Intl.DateTimeFormat('tr-TR', options).format(date);
  
  return formattedDate.replace(',', '');
}
