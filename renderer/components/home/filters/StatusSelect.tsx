import { Listbox, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import { DynamicHeroIcon } from "../../globals/icons";

interface StatusSelectProps {
  onChange: (status: number) => void;
  value?: number;
}

const STATUS_LIST = [
  { name: "Semua", value: null },
  { name: "Pending", value: 0 },
  { name: "Proses", value: 1 },
  { name: "Bayar", value: 2 },
  { name: "Void", value: 5 },
  { name: "Batal", value: -1 },
];

const StatusSelect = ({ onChange, value }: StatusSelectProps) => {
  const [selected, setSelected] = useState(STATUS_LIST[0]);

  const _onChange = (data: { name: string; value: number }) => {
    setSelected(data);
    onChange(data.value);
  };

  useEffect(() => {
    if (value !== undefined) {
      let find = STATUS_LIST.findIndex((e) => e.value === value);

      if (find !== -1) {
        setSelected(STATUS_LIST[find]);
      }
    }
  }, [value]);

  return (
    <Listbox value={selected} onChange={_onChange}>
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white border py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span className="block truncate">{selected.name}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <DynamicHeroIcon
              icon="ChevronUpDownIcon"
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 z-20 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {STATUS_LIST.map((person, personIdx) => (
              <Listbox.Option
                key={personIdx}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-red-100 text-red-900" : "text-gray-900"
                  }`
                }
                value={person}
              >
                {({ selected, active }) => (
                  <div>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {person.name}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-red-600">
                        <DynamicHeroIcon
                          icon="CheckIcon"
                          className={`h-5 w-5 ${
                            active ? "text-red-600" : "text-gray-900"
                          }`}
                          aria-hidden="true"
                        />
                      </span>
                    ) : null}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default StatusSelect;
