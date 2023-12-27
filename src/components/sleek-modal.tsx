import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { HiXCircle } from 'react-icons/hi';

interface Props {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  disableClickOutside?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  children: JSX.Element | JSX.Element[];
}

export default function SleekModal(props: Props) {
  const getSize = (prop: string) => {
    switch (prop) {
      case 'sm':
        return 'w-1/4';
      case 'md':
        return 'w-1/2';
      case 'lg':
        return 'w-4/5';

      default:
        return 'w-4/5';
    }
  };

  return (
    <section
      className={`${
        props.isOpen ? 'flex w-full flex-auto z-40 absolute' : 'hidden'
      }`}>
      <Transition appear show={props.isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={props.disableClickOutside ? () => null : props.onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
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
                leaveTo="opacity-0 scale-95">
                <Dialog.Panel
                  className={`--max-w-md --w-4/5 mx-auto ${getSize(
                    props.size ?? 'w-4/5'
                  )} transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all`}>
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900">
                    <div className="flex w-full items-center justify-between gap-4 border-b border-slate-200 pb-2 md:text-2xl">
                      <span className="flex font-semibold">{props.title}</span>
                      <HiXCircle
                        className="_hover-settings h-6 w-6 md:h-8 md:w-8"
                        onClick={props.onClose}
                      />
                    </div>
                  </Dialog.Title>
                  <div className="flex w-full flex-col items-center justify-between gap-4 py-4">
                    {props.children}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </section>
  );
}
