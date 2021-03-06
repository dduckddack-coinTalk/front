import React, { ReactNode } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import classNames from 'classnames';

const CoinRate = ({
  rate = '0',
  children,
}: {
  rate?: string;
  children?: ReactNode;
}) => {
  return (
    <>
      {
        <motion.div
          initial={{
            opacity: 0,
            backgroundColor: 'transparent',
          }}
          animate={{
            opacity: 1,
            backgroundColor: rate?.includes('-') ? '#4c4ed8' : '#d84c4c',
          }}
          transition={{ type: 'spring', stiffness: 100 }}
          className={classNames(
            `font-thin font-bmjua  text-white rounded-2xl `,
            `text-xs`,
            `w-14`,
            `text-center`,
            `absolute`,
            `mt-14`
          )}
        >
          {rate}%
        </motion.div>
      }
    </>
  );
};

export default CoinRate;
