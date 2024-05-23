import { createNextId } from "./helpers.js";
import storage from "./storage.js"

const tag = "[Store]";

class Store {
  constructor(storage) {
    console.log(tag, "constructor");

    if (!storage) throw "no storage";

    this.storage = storage;
  }

  search(keyword) {
    this.addHistory(keyword) // 15. 이력을 추가한다

    return this.searchResult = this.storage.productData.filter((product) =>
      product.name.includes(keyword)
    ); // 5. storage의 productDate쪽에 filter를 걸어서 product의 이름과 keyword가 일치하는 부분이 있는지를 찾음
  }

  getKeywordList() {
    return this.storage.keywordData; // 11. 스토리지의 keywordDate를 리턴
  }

  getHistoryList() {
    return this.storage.historyData.sort(this._sortHistory); // 13. 스토리지의 historyDate를 날짜의 역순으로 리턴
  }

  _sortHistory(history1, history2) {
    return history2.date > history1.date; // 13. 최근검색어 목록이 정렬됨
  }

  removeHistory(keyword) { // 13. 내부변수 storage에 접근해서 historydata를 필터로 거름
    this.storage.historyData = this.storage.historyData.filter(
      (history) => history.keyword !== keyword // 13. keyword와 같은 히스토리 있으면 제거하고 재할당
    );
  }

  addHistory(keyword = "") { // 14. 검색어를 입력받고 hisotrydata에 추가함
    keyword = keyword.trim();
    if (!keyword) {
      return;
    }

    const hasHistory = this.storage.historyData.some(
      (history) => history.keyword === keyword //15. 지금 입력한 값과 같은것이 있다면 제거함
    );
    if (hasHistory) this.removeHistory(keyword);

    const id = createNextId(this.storage.historyData);
    const date = new Date(); // 15. 새로운 날짜로 추가함
    this.storage.historyData.push({ id, keyword, date });
    this.storage.historyData = this.storage.historyData.sort(this._sortHistory);
  }
}

const store = new Store(storage) // 5. storage를 받기 위함
export default store // 5. 방금 만든  store 바로 반환 main함수에서 Store를 가져다 쓸 수 있게됨
