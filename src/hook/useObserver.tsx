import { MutableRefObject, useEffect } from "react";

interface UseObserverProps {
  target: any;
  onIntersect: any;
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number | number[];
}

export default function useObserver({
  target,
  onIntersect,
  root = null,
  rootMargin = "0px",
  threshold = 1.0
}: UseObserverProps) {
  useEffect(() => {
    let observer: IntersectionObserver;

    if (target && target.current) {
        observer = new IntersectionObserver(onIntersect, { root, rootMargin, threshold })
        observer.observe(target.current)
    }

    // observer를 사용하는 컴포넌트가 해제되면 observer 역시 꺼 주자. 
    return () => observer && observer.disconnect();
}, [target, onIntersect, root, rootMargin, threshold]);
}