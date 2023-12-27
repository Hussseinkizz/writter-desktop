import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { HiChevronLeft } from 'react-icons/hi';
import { Button } from './ui/button';

interface Props {
  backPageLink?: string;
}

const BackButton = (props: Props) => {
  const router = useRouter();

  function handleClick() {
    props.backPageLink ? router.push(`/${props.backPageLink}`) : router.back();
    console.log(router.asPath, router);
  }

  function handlePopState(): boolean {
    if (!router.asPath.startsWith('/')) {
      router.push('/');
      return false;
    }
    return true;
  }

  useEffect(() => {
    router.beforePopState(handlePopState);
  });

  return (
    <Button
      variant="secondary"
      className="hidden md:flex"
      onClick={handleClick}>
      <HiChevronLeft className="h-5 w-5" />
      <span className="flex">Back</span>
    </Button>
  );
};

export default BackButton;
