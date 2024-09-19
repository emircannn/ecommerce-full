

interface Props {
    title: string;
    subTitle?: string;
    center?: boolean;
}

const Heading: React.FC<Props> = ({
    title,
    subTitle,
    center
}) => {
  return (
    <div className={center ? 'text-center' : 'text-start'}>
        <div className="text-xl font-semibold">
            {title}
        </div>
        <div className="font-medium text-sm text-third-dark mt-2">
            {subTitle}
        </div>
    </div>
  )
}

export default Heading