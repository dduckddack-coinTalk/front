import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  Autocomplete,
  Box,
  createFilterOptions,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import {
  selector,
  useRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';
import { useCoinChart } from '../hooks/useInitialize';
import { atomUseCoins } from '../atom/total.atom';
import { TypeDrawTicker } from '../atom/drawData.atom';
import { atomSelectCoinDefault } from '../atom/selectCoinDefault.atom';
import TvDrawingChart from '../components/TvChart/TvDrawingChart';
import classNames from 'classnames';
import ChatRoom from '../components/Chat/ChatRoom';
import CoinBarForChat from '../components/CoinBar/CoinBarForChat';
import MainWrapper from '../components/Common/MainWrapper';
import DrawTool from '../components/DrawTool/DrawTool';
import SearchIcon from '@mui/icons-material/Search';
import NewsHeadLine from '../components/News/NewsHeadLine';
import { useGenerateSocket } from '../hooks/useWebSocket';
import ClearIcon from '@mui/icons-material/Clear';

const ChatPage = () => {
  useGenerateSocket('SUBSCRIBE');

  const coins = useRecoilValue(atomUseCoins);
  const setDefaultCoins = useSetRecoilState(atomSelectCoinDefault);
  const [displayCoins, setDisplayCoins] = useState<TypeDrawTicker[]>();
  const [value, setValue] = useState<TypeDrawTicker>();

  useCoinChart();
  useLayoutEffect(() => {
    setDefaultCoins({
      coinType: 'C0101',
      coinSymbol: 'BTC',
      marketSymbol: 'KRW',
      siseCrncCd: 'C0100',
      coinName: '비트코인',
    });
  }, []);
  useLayoutEffect(() => {
    const result = coins.filter((item) => {
      return (
        item.coinSymbol === 'ETH' ||
        item.coinSymbol === 'BTC' ||
        item.coinSymbol === 'XRP'
      );
    });
    setDisplayCoins(result);
    setValue(result[0]);
    console.log(result[0]);
  }, [coins]);

  const filterOption = createFilterOptions({
    matchFrom: 'start',
    stringify: (option: TypeDrawTicker) => option.consonant!,
    trim: true,
  });

  return (
    <div
      className={classNames(`w-full h-full grid  col-span-12`)}
      style={{
        gridTemplateRows: 'auto auto',
      }}
    >
      <div className={classNames(`grid grid-cols-12`)}>
        <div
          className={classNames(
            `xl:col-start-1 xl:col-end-13`,
            `2xl:col-start-1 2xl:col-span-full`,
            `w-full h-full grid grid-cols-12`
          )}
        >
          <div className={classNames(`col-start-1 col-end-3 p-5`)}>
            {value && (
              <Autocomplete
                id="coin-comboBox"
                defaultValue={value}
                options={displayCoins || []}
                sx={{ width: '100%' }}
                filterOptions={filterOption}
                getOptionLabel={(e) => {
                  return e.coinName!;
                }}
                // getOptionDisabled
                // noOptionsText
                onChange={(e, v) => {
                  console.log(e);
                  console.log(v);
                  if (v === undefined || v === null) {
                    displayCoins && setValue(displayCoins[0]);
                    return;
                  }
                  setDefaultCoins({
                    coinType: v?.coinType!,
                    coinSymbol: v?.coinSymbol!,
                    marketSymbol: 'KRW',
                    siseCrncCd: v?.siseCrncCd!,
                    coinName: v?.coinName!,
                  });
                }}
                isOptionEqualToValue={(e, v) => {
                  return e.coinName === v.coinName;
                }}
                renderInput={(params) => (
                  <TextField
                    // label="코인"
                    {...params}
                    color="info"
                    variant="standard"
                    sx={{
                      'width': '100%',
                      'color': '#FF9900',
                      'input': {
                        border: 0,
                        color: '#FF9900',
                      },
                      'label': {
                        color: 'white',
                      },

                      'border': 0,
                      'borderColor': 'transparent',

                      '& .MuiAutocomplete-clearIndicator': {
                        visibility: 'hidden',
                        display: ' none',
                      },
                    }}
                  />
                )}
              />
            )}
          </div>

          <div className={classNames(`col-start-3 col-end-13 p-5`)}>
            <MainWrapper
              className={classNames(
                `w-full h-full`,
                `flex justify-center  items-center`
              )}
              style={{
                borderRadius: '4rem',
              }}
            >
              <NewsHeadLine />
              {/* 뉴스헤드라인 */}
            </MainWrapper>
          </div>
        </div>
      </div>

      {/* 코인검색, 헤드라인 */}

      {/* 본문 */}
      <div className={classNames(`grid grid-cols-12 gap-5`)}>
        {/*  좌측 코인/차트 정보*/}
        <div
          className={classNames(
            // `p-5`,
            `xl:col-start-1 xl:col-end-8`,
            `2xl:col-start-1 2xl:col-end-9`
          )}
        >
          <div
            className={classNames(`w-full h-full grid  gap-y-5 `)}
            style={{
              gridTemplateRows: '15% auto',
            }}
          >
            <CoinBarForChat />

            {/* <div className={classNames(`text-white`)}>
              여기가 그림판 도구가 들어간다..
            </div> */}
            <TvDrawingChart />
          </div>
        </div>

        {/* 채팅방 */}
        <div
          className={classNames(
            // `p-5`,
            `xl:col-start-8 xl:col-end-13`,
            `2xl:col-start-9 2xl:col-end-13`
          )}
        >
          <ChatRoom />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
