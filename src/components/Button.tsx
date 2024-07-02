import { HiPlus } from 'react-icons/hi2';
import { HiXMark } from 'react-icons/hi2';
import { Link } from 'react-router-dom';

interface ButtonProps {
  variant: string;
  children: React.ReactNode;
  maxWidth?: string;
  bg: string;
  [key: string]: any;
}

const background = props.bg === 'active' ? 'bg-ui-active' : 'bg-ui-base';
const baseStyles = `mb-4 px-4 py-2 text-sm ${background} border rounded-sm shadow-md w-full hover:border-ui-active transition-all duration-300`;
const normalStyles = `${baseStyles} border-ui-base text-ui-active`;

const deleteStyles = `${baseStyles} border-red-500 text-red-500`;

export const Button = function (props: ButtonProps) {
  switch (props.variant) {
    case 'add':
      return (
        <button className={normalStyles} {...props} style={{ maxWidth: props.maxWidth }}>
          <HiPlus size={22} style={{ display: 'inline-block' }} /> {props.children}
        </button>
      );
    case 'delete':
      return (
        <button className={deleteStyles} {...props}>
          <HiXMark size={22} style={{ display: 'inline-block' }} /> {props.children}
        </button>
      );
    default:
      return (
        <button className={normalStyles} {...props}>
          {props.children}
        </button>
      );
  }
};

export const ButtonLink = function (props: ButtonProps) {
  return (
    <Link className={normalStyles} {...props}>
      {props.children}
    </Link>
  );
};
