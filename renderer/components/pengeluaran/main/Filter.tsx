import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { getPengeluaran, setDate } from "../../../features/pengeluaranSlice";
import { formatDate } from "../../../utils/date";
import { Button } from "../../globals/buttons";
import { DynamicHeroIcon } from "../../globals/icons";

const Filter = () => {
  const dispatch = useDispatch();
  const { date } = useSelector(getPengeluaran);

  const [isOpen, setIsOpen] = useState(false);
  const [filterDate, setFilterDate] = useState(new Date());

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const _onSubmit = () => {
    dispatch(setDate(formatDate(filterDate)));
    closeModal();
  };

  useEffect(() => {
    if (isOpen) {
      setFilterDate(new Date(date));
    }
  }, [isOpen]);

  return (
    <>
      <button
        onClick={openModal}
        className="flex flex-row border py-2 px-2 text-xs gap-2 rounded-md"
      >
        <DynamicHeroIcon icon="AdjustmentsHorizontalIcon" />
        Filter
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg text-center font-medium leading-6 text-gray-900"
                  >
                    FILTER
                  </Dialog.Title>
                  <div className="mt-4">
                    <div className="mb-4">
                      <div className="relative">
                        <DatePicker
                          selected={filterDate}
                          onChange={(date) => {
                            if (date !== null) {
                              setFilterDate(date);
                            }
                          }}
                          dateFormat="yyyy-MM-dd"
                          className="text-sm rounded-lg border border-gray-300 font-medium w-full focus:ring-0 focus:border-gray-300"
                          maxDate={new Date()}
                        />
                        <div className="absolute top-3 right-3">
                          <DynamicHeroIcon icon="CalendarIcon" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button onClick={_onSubmit} blok>
                      Terapkan Filter
                    </Button>
                  </div>
                  <div className="absolute top-5 right-6">
                    <div
                      onClick={closeModal}
                      className="border p-1 rounded-full cursor-pointer hover:bg-red-100"
                    >
                      <DynamicHeroIcon
                        icon="XMarkIcon"
                        className="h-5 w-5 hover:text-red-900"
                      />
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Filter;
