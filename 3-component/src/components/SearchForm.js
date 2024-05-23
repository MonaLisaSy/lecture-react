import React from "react";

const SearchForm = ({ value, onChange, onSubmit, onReset }) => {
    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(); // 3. props의 콜백함수 호출
    };

    const handleReset = () => {
        onReset();
    };

    const handleChangeInput = (event) => {
        onChange(event.target.value);
    };

    return (
        <form 
          onSubmit={handleSubmit}
          onReset={handleReset}
        >  
          <input 
            type="text" 
            placeholder="검색어를 입력하세요" 
            autoFocus 
            value ={value}
            onChange={handleChangeInput} 
          />
          {value.length > 0 ? 
            (<button type="reset" className="btn-reset"  />
          ) : null} 
        </form>
    );
};

//2. 입력한 값을 저장해야하므로 함수 component보다는 클래스 component가 좋아보임
export default SearchForm;
