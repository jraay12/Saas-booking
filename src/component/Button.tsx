type Props = {
  name: string;
  onClick?: () => void;
  className?: string
};

const Button = (props: Props) => {
  return (
    <button
      className={`text-white text-sm px-2 py-2 rounded-md font-medium cursor-pointer bg-[#3525cc] ${props.className}`}
      onClick={props.onClick}
    >
      {props.name}
    </button>
  );
};

export default Button;
