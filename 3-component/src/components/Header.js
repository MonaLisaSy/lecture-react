import React from "react"; // 1. jsx를 사용하는 곳은 import React 해줘야함

const Header = (props) => { // 1. 리액트 element를 반환하는 Header라는 이름의 함수 props 사용이유? 재활용하기 위함
    return ( // 1. 리액트 element 반환
        <header>
            <h2 className="container">{props.title}</h2>
        </header>
    );
};

export default Header;