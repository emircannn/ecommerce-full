import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils';
import Icon from '@/components/icon';
import { useMediaQuery } from 'react-responsive';

export interface DataProps {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const Card = ({data}: {data: DataProps}) => {

  const location = useLocation();
  const first = useMediaQuery({ query: '(max-width: 1280px)' });

  const getColor = (path: string) => {
    const isCurrentPage = location.pathname === path;
    return isCurrentPage ? '#171717' : '#fff'
  };

  return (
    <Link to={data.href} className={cn("w-full rounded-xl  p-3 flex items-center gap-5 duration-300 hover:bg-third-dark", 
      location.pathname === data.href ? 'bg-scrx text-secondary-foreground' : 'text-white'
    )}>
        <Icon
          icon={data.icon}
          width={first ? '20px' : '30px'}
          height={first ? '20px' : '30px'}
          color={getColor(data.href)}
        />

        <p className={cn('text-xs font-semibold truncate',
        )}>{data.title}</p>
    </Link>
  )
}

export default Card