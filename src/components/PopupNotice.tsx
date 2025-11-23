import { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { removeNotice } from '@/store/slices/noticeSlice';

const PopupNotice = () => {
  const notices = useSelector((state: RootState) => state.notice.notices);
  const dispatch = useDispatch();

  const timers = useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    if (notices.length > 0) {
      notices.forEach(notice => {
        if (!timers.current[notice.id]) {
          timers.current[notice.id] = setTimeout(() => {
            dispatch(removeNotice({ id: notice.id }));
          }, 3000);
        }
      });
    }
  }, [notices, dispatch]);

  if (notices.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 p-4">
      {notices.map(notice => (
        <div
          key={notice.id}
          className="bg-main border split-line rounded-lg shadow-lg p-3 text-theme-strong"
        >
          {notice.content}
        </div>
      ))}
    </div>
  );
};

export default PopupNotice;
