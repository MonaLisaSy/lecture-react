import { formatRelativeDate } from "./js/helpers.js";
import store from "./js/Store.js"

// 8. 탭 설정
const TabType = { 
  KEYWORD: "KEYWORD",
  HISTORY: "HISTORY",
};

const TabLabel = {
  [TabType.KEYWORD]: "추천 검색어",
  [TabType.HISTORY]: "최근 검색어",
};

// 0. 리액트가 제공하는 컴포넌트 클래스를 상속해서 render메소드를 만들어주면 컴포넌트됨
class App extends React.Component { // 0. App은 객체화 필요
  constructor() { // 0. 생성자 함수
      super(); // 0. React.Component를 상속받았기에 부모 호출

      this.state = { // 0. state는 컴포넌트의 상태 저장
        // 0. browser가 관리하는것을 리액트가 관리하기 위함
        searchKeyWord: "", // 0. 입력값을 나타내는 상태
        searchResult: [], // 5. 검색결과를 담는 상태
        submitted: false, // 6. 검색을 했냐 안했냐를 담는 상태
        selectedTab: TabType.KEYWORD, // 9. 탭이 어느것이 선택됬는지 상태
        keywordList: [], // 11. 추천검색어를 나타내기 위한 상태
        historyList: [], // 13. 최근검색어를 나타내기 위한 상태
      };
  }
  componentDidMount(){ // 11. store꺼 가져와서 업데이트해줌 
    const keywordList = store.getKeywordList();
    const historyList = store.getHistoryList();

    this.setState({ 
      keywordList,
      historyList,
    });
  }

  handleChangeInput(event){ //1. event는 사용자가 입력한 값
    // this.state.searchKeyWord = event.target.value; // 1. searchKeyWord를 이 값으로 변경
    // this.forceUpdate() //1. 필요할때만 렌더링하기에 강제로 업데이트시킴

    // this.setState({ // 1. 컴포넌트를 변경시키겠다는 약속된 표현
    //   searchKeyWord: event.target.value,
    // });
    // or 1.
    const searchKeyWord = event.target.value;
    if (searchKeyWord.length <= 0){ // 4. x버튼뿐만 아니라 내가 자력으로 delete로 지우더라도 console상에서 지움
      return this.handleReset();
    }
    this.setState({searchKeyWord})

    if(searchKeyWord.length <= 0 && this.state.submitted) { // 7. x버튼을 클릭하지 않고 제출된 상태에서 delete키로 글자가 사라져도 결과 창 없앰
      return this.handleReset()
    }
  }
  
  handleSubmit(event){ // 3. 제출시 사용
    event.preventDefault(); // 3. Enter클릭시 새로고침 현상 해결
    console.log('TOOD: handleSubmit', this.state.searchKeyWord);
    this.search(this.state.searchKeyWord) // 5. Enter시 검색어를 입력받아서 검색 결과를 만들어주기 위함
  }

  search(searchKeyWord){ // 5. 검색어를 입력받고 검색 결과를 만들어주기 위한 함수
    const searchResult = store.search(searchKeyWord); // 5. store에서 가져옴
    const historyList = store.getHistoryList();

    this.setState({ 
      searchKeyWord, // 12. 추천검색어에서 클릭했을때 검색창에 해당 검색어 나타나게 함
      searchResult,
      historyList,
      submitted: true,
    }); // 6. 검색할시 submitted도 false -> true로 변경해줌
  }


  handleReset(){ // 4. X버튼 클릭시 사용
    this.setState({ 
      searchKeyWord : "",
      searchResult: [],
      submitted : false, // 7. x버튼 클릭시 검색결과를 사라지게 하기
    }); // 4. input에서는 삭제되지만 console에는 여전히 남아 있음

    this.setState(()=>{ // 4. 값이 변경됬다는 걸 보장한 후에 console로 출력
      return { searchKeyWord: ""} // 4. 변경된 상태 반환
    }, 
    () => {
      console.log('TOOD: handleReset', this.state.searchKeyWord);// 4. state가 변경이 완료되면 호출되는 함수
    })
  }
  
  handleClickRemoveHistory(event, keyword) { // 13. x버튼 클릭시 최근 검색어 삭제
    event.stopPropagation(); // 13. 해당 이벤트안에서만 처리
    store.removeHistory(keyword); // 13. storage에서 keyword에 해당하는 history 삭제
    const historyList = store.getHistoryList();
    this.setState({historyList});
  }


  render(){ // 0. react element를 반환헤야됨
    const searchForm = (
      <form 
            onSubmit = {(event) => this.handleSubmit(event)}
            onReset= {() => this.handleReset(event)} // 4. event를 사용할 일이 없음
          >  
            <input 
              type="text" 
              placeholder="검색어를 입력하세요" 
              autoFocus 
              value ={this.state.searchKeyWord}
              onChange={(event) => this.handleChangeInput(event)} //1. input에서 changeevent발생시 사용
            />
            {/* <button 
              type="reset" 
              className="btn-reset"
            ></button> */}
            {/* {resetButton} */}
            { //  2. ? : 방식도 되고 && 으로 바로 할수도 있음
            this.state.searchKeyWord.length > 0 ? 
            (<button type="reset" className="btn-reset"></button>
            ) : null} 
      </form>
    );

    const searchResult = (
      this.state.searchResult.length > 0 ? (
        // 5. Storage 영역을 이용함
        <ul className = "result"> 
          {this.state.searchResult.map((item, index) => { // 5. searchResult 배열을 map함수로 돌면서 li element를 배열로 만듬
            return (
              // 6. key값을 넘겨줌으로써 가상돔의 여유를 갖게 만들고 차이를 만들어줌
              <li key = {item.id} >  
                <img src={item.imageUrl} alt={item.name}/>
                <p>{item.name}</p>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className = "empty-box">검색 결과가 없습니다</div>
      )
    );

    const keywordList = (
      <ul className ="list">
        {this.state.keywordList.map((item, index) => {
          return (
            <li 
              key = {item.id}
              onClick = {()=>this.search(item.keyword)} // 12. 클릭시 해당 결과창으로 이동
            >
              {/* // 1부터 시작 */}
              <span className="number">{index+1}</span> 
              <span>{item.keyword}</span>
            </li>
          );
        })}
      </ul>
    );
    
    const historyList = (
      <ul className = "list">
        {this.state.historyList.map(({id,keyword, date}) => {
          return (
            <li 
              key={id}
              onClick={()=>this.search(keyword)}
            >
              <span>{keyword}</span>
              <span className = "date"> {formatRelativeDate(date)} </span>
              <button 
                className = "btn-remove" 
                onClick = { event => this.handleClickRemoveHistory(event, keyword)}
              />
            </li>
          );
        })} 
      </ul>
    );
    
    {/* // let resetButton = null // 2. 버튼을 담아주기 위함

    // if(this.state.searchKeyWord.length > 0){ // 2. 검색어가 입력되면 버튼이 나옴
    //   resetButton = <button type="reset" className="btn-reset"></button> */}
    {/* // 8. 탭을 위한 element 만들기 */}
    {/* // 10. root노드가 3개이기에 <></> fragment로 감싸놓음 */}
    const tabs = ( 
      <> 
        <ul className = "tabs" >
        {/* // 8. Object.values로 Tab타입의 값을 모두 가져와서 배열로 만듬 */}
          {Object.values(TabType).map((TabType) => (
            <li 
              className = {this.state.selectedTab === TabType ? "active" : ""} // 9. 탭이 같은지에 따라 활성화 or 비활성화 
              key = {TabType}
              onClick = {() => this.setState({ selectedTab: TabType})} // 9. 클릭시켜 selectedTab 업데이트 
            >
              {TabLabel[TabType]}
            </li>
            
          ))} 
        </ul>
        {this.state.selectedTab === TabType.KEYWORD && keywordList}
        {this.state.selectedTab === TabType.HISTORY && historyList}
      </>
    )

    {/* // 0. div를 쓰지 않고 빈곳으로 놓아둠 */}
    return (
      
      <> 
        <header>
          <h2 className="container">검색</h2>
        </header>
        <div className ="container"> 
          {/* 3. form 에서 Enter 입력시 서브밋 이벤트 발생 */}
          {searchForm}
          {/* // 5. 검색 결과 부분(검색을 한 경우 결과가 나오고 안한 경우 안나옴)*/}
          <div className = "content"> 
            {/* // 6. submitted가 있을 경우에만 출력 */}
            {this.state.submitted ? searchResult : tabs} 
          </div>
        </div>
      </>
    );
  }
}




ReactDOM.render(<App/>, document.querySelector("#app")); // 0. class App을 렌더링함
