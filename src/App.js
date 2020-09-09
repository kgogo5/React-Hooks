import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import useAxios from "./useAxios";
import UseTap from "./Components/UseTap";
import UseInput from "./Components/UseInput";

const Number = styled.div`
  text-align: center;
  min-height: 200vh;
  margin: 200px auto;

  div {
    font-size: 30px;
    font-weight: 600;
    margin: 20px 0;
  }

  button {
    margin: 5px;
    font-size: 18px;
    border: 0;
    padding: 5px 8px;
    border-radius: 0 !important;
  }
`;

const useClick = (onClick) => {
  const element = useRef();

  useEffect(() => {
    if (element.current) {
      element.current.addEventListener("click", onClick);
    }

    return () => {
      if (element.current) {
        element.current.removeEventListener("click", onClick);
      }
    };
  }, []); // 한번만 이벤트리스너가 실행되게 한다.
  return element;
};

// 회원가입이라던지 확인 할때 사용하는 메시지
const useConfirm = (message, onConfirm, onCancel) => {
  if (!onConfirm || typeof onConfirm !== "function") {
    return;
  }
  if (onCancel && typeof onCancel !== "function") {
    return;
  }
  const confirmAction = () => {
    if (window.confirm(message)) {
      //message가 있다면 onConfirm 함수가 작동되게됨.
      onConfirm();
    } else {
      onCancel();
    }
  };
  return confirmAction;
};

// 창을 닫았을때 확인 메시지
const usePrevent = () => {
  const unloading = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };

  const enablePrevent = () =>
    window.addEventListener("beforeunload", unloading);
  const disablePrevent = () =>
    window.removeEventListener("beforeunload", unloading);
  return { enablePrevent, disablePrevent };
};

// 마우스가 브라우저를 떠났을때
const useBeforeLeave = (onBefore) => {
  useEffect(() => {
    document.addEventListener("mouseleave", handle);
    return () => document.removeEventListener("mouseleave", handle);
  }, []);

  if (typeof onBefore !== "function") {
    return;
  }

  const handle = (event) => {
    console.log(event); //로그를 확인후에 다양한 마우스 옵션을 파악해서 이용할 수 있음
    onBefore();
  };
};

// fadein 효과
const useFadeIn = (duration = 1, delay = 0) => {
  const element = useRef();
  useEffect(() => {
    if (element.current) {
      const { current } = element;
      current.style.transition = `opacity ${duration}s ease-in-out ${delay}s`;
      current.style.opacity = 1;
    }
    return;
  }, []);

  if (typeof duration !== "number" || typeof delay !== "number") {
    return;
  }
  return { ref: element, style: { opacity: 0 } };
};

// 네트워크 online, offline 상태 확인
const useNetwork = (onchange) => {
  const [status, setStatus] = useState(navigator.onLine);
  const handleChange = () => {
    if (typeof onchange === "function") {
      onchange(navigator.onLine);
    }
    setStatus(navigator.onLine);
  };

  useEffect(() => {
    window.addEventListener("online", handleChange);
    window.addEventListener("offline", handleChange);

    return () => {
      window.removeEventListener("online", handleChange);
      window.removeEventListener("offline", handleChange);
    };
  }, []);

  return status;
};

// 스크롤 이벤트
const useScroll = () => {
  const [state, setState] = useState({
    x: 0,
    y: 0,
  });

  const onScroll = () => {
    setState({ y: window.scrollY, x: window.scrollX });
  };
  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return state;
};

// 풀스크린 이벤트
const useFullscreen = () => {
  const element = useRef();
  const triggerFull = () => {
    if (element.current) {
      element.current.requestFullscreen();
    } else if (element.current.mozRequestFullScreen) {
      element.current.mozRequestFullScreen();
    } else if (element.current.webkitRequestFullscreen) {
      element.current.webkitRequestFullscreen();
    } else if (element.current.msRequestFullscreen) {
      element.current.msRequestFullscreen();
    }
  };

  const exitFull = () => {
    if (document.fullscreen) {
      document.exitFullscreen();
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  return { element, triggerFull, exitFull };
};

// 알람 이벤트
const useNotification = (title, option) => {
  if (!("Notification" in window)) {
    return;
  }
  const fireNotif = () => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, option);
        } else {
          return;
        }
      });
    } else {
      new Notification(title, option);
    }
  };
  return fireNotif;
};

function App() {
  const { loading, data, refetch } = useAxios({
    url: "https://yts.am/api/v2/list_movies.json",
  });

  // 알람 이벤트
  const triggerNotif = useNotification("알람이 성공적으로 등록되었습니다.", {
    body: "옵션",
  });

  // 풀스크린 이벤트
  const { element, triggerFull, exitFull } = useFullscreen();

  // 스크롤 이벤트
  const { y } = useScroll();

  // 네트워크 online, offline 상태 확인
  const handleNetworkChange = (online) => {
    console.log(online ? "we just went online" : "we are offline");
  };
  const onLine = useNetwork(handleNetworkChange);

  // fadein 효과
  const fadeInH2 = useFadeIn(2, 1);
  const fadeInH1 = useFadeIn(3);

  // 마우스가 브라우저를 떠났을때
  const begForLife = () => console.log("please don't leave.");
  useBeforeLeave(begForLife);

  // 창을 닫았을때 확인 메시지
  const { enablePrevent, disablePrevent } = usePrevent();

  // 회원가입이라던지 확인 할때 사용하는 메시지
  const confirm = () => console.log("회원가입을 신청완료");
  const aborted = () => console.log("회원가입 신청 취소");
  const confirmClick = useConfirm(
    "회원가입을 신청하시겠습니까?",
    confirm,
    aborted
  );

  // useState 활용
  const hello = () => console.log(`hello world`);
  const click = useClick(hello);

  return (
    <div className="App">
      <Number>
        <h1 {...fadeInH1}>탭</h1> <span>{onLine ? "Online" : "Offline"}</span>
        <UseTap />
        <div
          style={{
            position: "fixed",
            top: 100,
            color: y > 400 ? "blue" : "red",
          }}
        >
          scroll status check
        </div>
        <button ref={click}>Click!</button>
        <button onClick={confirmClick}>confirm button</button>
        <br />
        <button onClick={enablePrevent}>enablePrevent</button>
        <button onClick={disablePrevent}>disablePrevent</button>
        <br />
        <button onClick={begForLife}>useBeforeLeave</button>
        <br />
        <h2 {...fadeInH2}>FadeIn</h2>
        <div>
          <div ref={element}>
            <img
              src="https://images.unsplash.com/photo-1593462447694-f8ca79f8f8ab?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"
              alt="unsplash images"
            />
            <br />
            <button onClick={exitFull}>Exit fullscreen button</button>
          </div>
          <button onClick={triggerFull}>Enter fullscreen button</button>
        </div>
        <div>
          <button onClick={triggerNotif}>Notification</button>
        </div>
        <div>
          <h2>{data && data.status}</h2>
          <h3>{loading && "Loading"}</h3>
          <button onClick={refetch}>Refetch</button>
        </div>
      </Number>
      <UseInput />
    </div>
  );
}

export default App;
