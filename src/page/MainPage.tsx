import classNames from 'classnames';
import { motion } from 'framer-motion';
import React from 'react';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { atomSelectCoinDefault } from '../atom/selectCoinDefault.atom';
import BestCoin from '../components/BestCoin/BestCoin';
import OnlyDisplayChat from '../components/Chat/OnlyDisplayChat';
import { useCoinList } from '../hooks/useInitialize';
import { useGenerateSocket } from '../hooks/useWebSocket';

const MainPage = () => {
  useCoinList();

  return (
    <div
      className={classNames(
        `grid grid-cols-12 `,
        `max-h-full`,
        `h-full overflow-hidden scrollbar-hide`
      )}
    >
      <BestCoin
        className={classNames(
          `col-start-3 col-end-7  drop-shadow-2xl`,
          `h-5/6 my-auto mx-2`
        )}
      />
      <OnlyDisplayChat
        className={classNames(
          `col-start-7 col-end-11  drop-shadow-2xl`,
          `h-5/6 my-auto mx-2`
        )}
      />
    </div>
  );
};

export default React.memo(MainPage);
