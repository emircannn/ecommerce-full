import { Link, useLocation } from 'react-router-dom'
import Icon from '../icon'
import { cn } from '@/lib/utils';
import { useTheme } from '../theme-provider';

export interface DataProps {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const Card = ({data}: {data: DataProps}) => {

  const location = useLocation();
  const { theme } = useTheme();

  const getColor = (path: string) => {
    const isCurrentPage = location.pathname === path;
    const isDarkMode = theme === 'dark';
    
    if (isCurrentPage) {
      return isDarkMode ? '#1a1a1a' : '#1a1a1a';
    }
    return isDarkMode ? '#FFD700' : '#1a1a1a';
  };

  return (
    <Link to={data.href} className={cn("w-full rounded-xl  p-3 flex items-center gap-5 duration-300", 
      location.pathname === data.href ? 'bg-thirth text-darkPrimary' : 'dark:bg-darkPrimary dark:text-white bg-white text-darkPrimary'
    )}>
        <Icon
          icon={data.icon}
          width='30px'
          height='30px'
          color={getColor(data.href)}
        />

        <p className={cn('duration-300 text-xs font-semibold truncate', 
          location.pathname === data.href ? 'text-darkPrimary' : 'dark:text-thirth text-darkPrimary'
        )}>{data.title}</p>
    </Link>
  )
}

export default Card