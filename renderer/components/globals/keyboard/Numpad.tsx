import React from 'react';

type ButtonNumpadProps = {
  text: string;
  onClick: () => void;
};

type NumpadProps = {
  value: string;
  onChange: (val: string) => void;
  isNullable?: boolean;
};

const ButtonNumpad = ({ text, onClick }: ButtonNumpadProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs font-medium py-2 border rounded active:bg-gray-100"
    >
      {text}
    </button>
  );
};

const Numpad = ({ value, onChange, isNullable }: NumpadProps) => {
  const onTapNumber = (val: string) => {
    if (isNullable) {
      onChange(value + val);
    } else if (!isNullable && value !== '0') {
      onChange(value + val);
    } else {
      onChange(val);
    }
  };

  const onTapReset = () => {
    if (isNullable) {
      onChange('');
    } else {
      onChange('0');
    }
  };

  const onTapDelete = () => {
    if (value.length !== 1) {
      onChange(value.slice(0, -1));
    } else if (isNullable) {
      onChange('');
    } else {
      onChange('0');
    }
  };
  return (
    <div className="grid grid-cols-3 gap-2">
      <ButtonNumpad text="7" onClick={() => onTapNumber('7')} />
      <ButtonNumpad text="8" onClick={() => onTapNumber('8')} />
      <ButtonNumpad text="9" onClick={() => onTapNumber('9')} />
      <ButtonNumpad text="4" onClick={() => onTapNumber('4')} />
      <ButtonNumpad text="5" onClick={() => onTapNumber('5')} />
      <ButtonNumpad text="6" onClick={() => onTapNumber('6')} />
      <ButtonNumpad text="1" onClick={() => onTapNumber('1')} />
      <ButtonNumpad text="2" onClick={() => onTapNumber('2')} />
      <ButtonNumpad text="3" onClick={() => onTapNumber('3')} />
      <ButtonNumpad text="Reset" onClick={onTapReset} />
      <ButtonNumpad text="0" onClick={() => onTapNumber('0')} />
      <ButtonNumpad text="Del" onClick={onTapDelete} />
    </div>
  );
};

Numpad.defaultProps = {
  isNullable: false,
};

export default Numpad;
