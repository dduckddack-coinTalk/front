import { AppBar, Box, Toolbar } from '@mui/material';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import React from 'react';
import CI from '../../asset/img/sp_main_new.png';
import bg_main from '../../asset/img/bg_main.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AvatarWrapper from '../Avatar/AvatarWrapper';
import HeaderSignIn from './HeaderSignIn';
import HeaderNavTab from './HeaderNavTab';

const Header = () => {
  const navigate = useNavigate();
  const isLogin = false;
  // 로그인된 사용자 정보를 가져온다.
  return (
    <AppBar
      position="static"
      sx={{
        // backgroundImage: `url(${bg_main})`,
        backgroundColor: 'transparent',
        zIndex: 99,
        borderBottom: '1px',
      }}
      className={classNames(`shadow-2xl`)}
    >
      <Toolbar>
        <motion.div
          whileHover={{
            scaleX: 0.9,
          }}
          className={classNames(`w-full h-full bg-no-repeat ml-4`)}
          style={{
            marginTop: '-1.2rem',
            width: '179px',
            height: '52px',
            flexGrow: 0,
            backgroundImage: `url(${CI})`,
            backgroundPosition: '29px 14px',
          }}
          onClick={() => {
            navigate('/');
          }}
        />
        <Box>
          <HeaderNavTab />
        </Box>

        <Box className={'absolute right-0 flex-grow'}>
          <div
            onClick={async () => {
              // const a = await axios.get('https://3.90.102.135/user/test');
              try {
                const a = await axios.get(
                  'https://cointalk.kro.kr:8080/test?message=test'
                );
                console.log(a);
              } catch (err) {
                console.error(err);
              }
            }}
          >
            user/test get
          </div>
          {isLogin ? <AvatarWrapper /> : <HeaderSignIn />}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default React.memo(Header);
