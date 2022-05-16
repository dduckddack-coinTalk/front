import axios from 'axios';
import html2canvas from 'html2canvas';
import { IChartApi, LogicalRange } from 'lightweight-charts';
import _ from 'lodash';
import moment from 'moment';
import { userInfo } from 'os';
import { useEffect, useRef, useState } from 'react';
import { ReactSketchCanvasRef } from 'react-sketch-canvas';
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { API_DRAW } from '../../api/draw.api';
import { atomSelectCoinDefault } from '../../atom/selectCoinDefault.atom';
import { atomSelectCoinDetail } from '../../atom/selectCoinDetail.atom';
import {
  atomChartData,
  atomDrawStBars,
  selectorDrawStBars,
} from '../../atom/tvChart.atom';
import {
  atomUserChartDatas,
  atomUserInfo,
  IUserChatDatas,
} from '../../atom/user.atom';
import { dduckddackResponseVO } from '../../type/api';
import useGetContext from './useGetContext';
import useResizeCanvas from './useResizeCanvas';

const useGenerateDrawCanvas = (
  tvChartRef: React.MutableRefObject<HTMLDivElement | null>,
  pause: boolean,
  setPause: React.Dispatch<React.SetStateAction<boolean>>,
  chartRef: React.MutableRefObject<IChartApi | null | undefined>,
  setRecordRange: React.Dispatch<React.SetStateAction<LogicalRange | undefined>>
) => {
  const canvasRef = useRef<ReactSketchCanvasRef | null>(null);
  const canvasWrapperRef = useRef<HTMLDivElement | null>(null);
  const saveWrapperRef = useRef<HTMLDivElement | null>(null);

  const [uesrData, setUserData] = useRecoilState(atomUserChartDatas);
  const [chartData, setChartData] = useRecoilState(atomDrawStBars);
  const selectorDrawStbars = useRecoilValueLoadable(selectorDrawStBars);
  const userInfo = useRecoilValue(atomUserInfo);
  const selectedCoin = useRecoilValue(atomSelectCoinDefault);

  useEffect(() => {
    const { state, contents } = selectorDrawStbars;
    if (state === 'hasValue') {
      contents && setChartData(contents);
    } else if (state === 'hasError') {
      console.error(state);
    }
  }, [selectorDrawStbars]);

  // const ctx = useGetContext(canvasRef);

  // canvasRef.current.
  const [drawingMode, setDrawingMode] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [eraseMode, setEraseMode] = useState(false);

  const [drawAxisDatas, setDrawAxisDatas] = useState<
    Array<{
      x: any;
      y: any;
      originX: any;
      originY: any;
    }>
  >([]);

  const [moveAxis, setMoveAxis] = useState<{
    x: any;
    y: any;
  }>({
    x: 0,
    y: 0,
  });

  const [width, height] = useResizeCanvas(
    canvasWrapperRef,
    tvChartRef,
    chartRef
  );

  const onDrawToogleClick = () => {
    setDrawingMode(!drawingMode);
    setPause(!pause);
  };

  const onSave = async () => {
    // 이미지로 저장
    // let imageUrl = '';

    const mTime = moment().format('YYYY-MM-DD HH:mm:ss');
    const timeTitle = document.createElement('h1');
    timeTitle.className =
      'font-bmjua flex justify-center items-center h-32 w-full';
    timeTitle.innerText = mTime;

    if (saveWrapperRef.current) {
      saveWrapperRef.current.prepend(timeTitle);
      saveWrapperRef.current.style.transform = 'translateX(-100%)';
      await html2canvas(saveWrapperRef.current)
        .then((canvas) => {
          if (saveWrapperRef.current) {
            if (
              userInfo.accessToken === undefined &&
              userInfo.userInfo === undefined
            ) {
              return;
            }

            canvas.toBlob(async (e) => {
              let imageUrl: Blob | null = e;
              if (userInfo.userInfo && imageUrl !== null) {
                const id = userInfo.userInfo?.id?.toString() as string;
                const today = moment().utc(true).valueOf().toString();
                const formData = new FormData();
                formData.append(
                  'image',
                  imageUrl,
                  `${userInfo.userInfo.email}_${today}.png`
                );
                formData.append('userId', id);
                formData.append('time', today);
                formData.append('coin', selectedCoin.coinSymbol);
                if (formData) {
                  try {
                    const result = await axios.post<
                      dduckddackResponseVO<IUserChatDatas>
                    >(API_DRAW.UPLOAD_IMAGE, formData, {
                      headers: {
                        'Content-Type': 'application/json',
                      },
                    });

                    if (result.data.status === 'ok') {
                      const resultData = result.data.message;
                      const prevData = JSON.parse(JSON.stringify(uesrData));
                      prevData.push(resultData);
                      setUserData(prevData);
                    }
                  } catch (err) {
                    console.log(err);
                  }
                }
              }
            });
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          if (saveWrapperRef.current) {
            saveWrapperRef.current.removeChild(timeTitle);
            saveWrapperRef.current.style.transform = 'translateX(0%)';
          }
        });
    }
    // const prev = JSON.parse(JSON.stringify(drawAxisDatas));
    // 드로우 배열에 넣는다.

    // setDrawAxisDatas([]);
    // // 트레이딩뷰 좌표 기억
    // if (chartRef.current) {
    //   const range = chartRef.current?.timeScale().getVisibleLogicalRange();
    //   if (range) {
    //     setRecordRange(range);
    //   }
    // }
  };

  const onSaveAs = (uri: any, filename: any) => {
    console.log('onSaveas');
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = uri;
    link.download = filename;
    link.click();
    document.body.removeChild(link);
  };

  const onErase = () => {
    if (canvasRef.current) {
      canvasRef.current?.eraseMode(!eraseMode);
    }
    setEraseMode(!eraseMode);
  };

  const onUndo = () => {
    if (canvasRef.current) {
      canvasRef.current.undo();
    }
  };

  const onRedo = () => {
    if (canvasRef.current) {
      canvasRef.current.redo();
    }
  };

  return [
    canvasRef,
    canvasWrapperRef,
    saveWrapperRef,
    drawingMode,
    onDrawToogleClick,
    onSave,
    onErase,
    onUndo,
    onRedo,

    width,
    height,
  ] as const;
};

export default useGenerateDrawCanvas;
