package kr.spring.board.service;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Delete;

import kr.spring.board.vo.BoardFavVO;
import kr.spring.board.vo.BoardReFavVO;
import kr.spring.board.vo.BoardReplyVO;
import kr.spring.board.vo.BoardResponseVO;
import kr.spring.board.vo.BoardVO;

public interface BoardService {
	//부모글
	public List<BoardVO> selectList(Map<String,Object> map);
	public Integer selectRowCount(Map<String,Object> map);
	public void insertBoard(BoardVO board);
	public BoardVO selectBoard(Long board_num);
	public void updateHit(Long board_num);
	public void updateBoard(BoardVO board);
	public void deleteBoard(Long board_num);
	public void deleteFile(Long board_num);
	//부모글 좋아요
	public BoardFavVO selectFav(BoardFavVO fav);
	public Integer selectFavCount(Long board_num);
	public void insertFav(BoardFavVO fav);
	public void deleteFav(BoardFavVO fav);
	//댓글
	public List<BoardReplyVO> selectListReply(Map<String,Object> map);
	public Integer selectRowCountReply(Map<String,Object>map); //mybatis는 객체형태로 처리하기 때문에 int보다 Integer로 명시한다. int를 써도 자동으로 바뀌긴함. 그냥 명시를 맞게 해주는게 좋아서 
	public BoardReplyVO selectReply(Long re_num);
	public void insertReply(BoardReplyVO boardReply);
	public void updateReply(BoardReplyVO boardReply);
	public void deleteReply(Long re_num);
	//댓글 좋아요
	public BoardReFavVO selecReFav(BoardReFavVO fav);
	public Integer selectReFavCount(Long re_num);
	public void insertReFav(BoardReFavVO fav);
	public void deleteReFav(BoardReFavVO fav);
	
	//답글(대댓글)
	public List<BoardResponseVO> selectListResponse(Long re_num);
	public BoardResponseVO selectResponse(Long te_num);
	public void insertResponse(BoardResponseVO boardResponse);
	public void updateResponse(BoardResponseVO boardResponse);
	public void deleteResponse(Long te_num);
	public Integer selectResponseCount(Long re_num);
}
