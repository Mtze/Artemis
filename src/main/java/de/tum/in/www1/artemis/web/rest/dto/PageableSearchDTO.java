package de.tum.in.www1.artemis.web.rest.dto;

import de.tum.in.www1.artemis.domain.enumeration.SortingOrder;

/**
 * Wrapper for a generic search for any list of entities matching a given search term. The result should be paged,
 * meaning that it only contains a predefined number of elements in order to not fetch and return too many.
 *
 * @see SearchResultPageDTO
 * @param <T> The type of the column for which the result should be sorted by
 */
public class PageableSearchDTO<T> {

    /**
     * The number of the page to return
     */
    private int page;

    /**
     * The maximum size of one page
     */
    private int pageSize;

    /**
     * The string to search for
     */
    private String searchTerm;

    /**
     * The sort order, i.e. descending or ascending
     */
    private SortingOrder sortingOrder;

    /**
     * The column for which the result should be sorted by
     */
    private T sortedColumn;

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public String getSearchTerm() {
        return searchTerm;
    }

    public void setSearchTerm(String searchTerm) {
        this.searchTerm = searchTerm;
    }

    public SortingOrder getSortingOrder() {
        return sortingOrder;
    }

    public void setSortingOrder(SortingOrder sortingOrder) {
        this.sortingOrder = sortingOrder;
    }

    public T getSortedColumn() {
        return sortedColumn;
    }

    public void setSortedColumn(T sortedColumn) {
        this.sortedColumn = sortedColumn;
    }
}
