

export default function Icon({ IconComponent, className, onClick }) {
  return (
      <span >
              <IconComponent className={className} onClick={onClick}/>
      </span>
  );
}
