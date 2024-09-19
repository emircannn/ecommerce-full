import Rating from '@mui/material/Rating';
import { styled } from '@mui/material';

const RatingComp = ({
    value=4,
    size=24
}: {
 value?: number | string,
 size?: number
}) => {

    const CustomRating = styled(Rating)(() => ({
        '& .MuiRating-iconFilled': {
          color: '#FFD700',
        },
        '& .MuiRating-iconEmpty': {
          color: '#e0e0e0',
        },
        '& .MuiRating-icon': {
          fontSize: `${size}px`,
        },
      }));

      const numericValue = typeof value === 'string' ? parseFloat(value) : value;

  return (
    <div className='flex items-center gap-2'>
        <span className='font-semibold'>{value}</span>
      <CustomRating
        name="read-only"
        value={numericValue}
        readOnly 
      />
    </div>
  )
}

export default RatingComp