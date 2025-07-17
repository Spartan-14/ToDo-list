"use client"

import { useSelector, useDispatch } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faSort,
    faSortUp,
    faSortDown,
    faCalendarAlt,
    faEdit,
    faFont,
    faExclamationTriangle,
    faLayerGroup,
} from "@fortawesome/free-solid-svg-icons"
import { setSortBy, setSortOrder, setGroupBy, toggleSortOrder } from "../store/todoSlice"

const SortingControls = () => {
    const dispatch = useDispatch()
    const { sortBy, sortOrder, groupBy } = useSelector((state) => state.todos)

    const sortOptions = [
        { value: "dateCreated", label: "Date Created", icon: faCalendarAlt },
        { value: "dateModified", label: "Date Modified", icon: faEdit },
        { value: "name", label: "Name", icon: faFont },
        { value: "priority", label: "Priority", icon: faExclamationTriangle },
    ]

    const groupOptions = [
        { value: "none", label: "No Grouping" },
        { value: "dateCreated", label: "Date Created" },
        { value: "dateModified", label: "Date Modified" },
        { value: "name", label: "Name" },
        { value: "priority", label: "Priority" },
    ]

    const handleSortChange = (newSortBy) => {
        if (newSortBy === sortBy) {
            // If clicking the same sort option, toggle order
            dispatch(toggleSortOrder())
        } else {
            // If clicking a different sort option, set it and default to ascending
            dispatch(setSortBy(newSortBy))
            dispatch(setSortOrder("asc"))
        }
    }

    const getSortIcon = (option) => {
        if (sortBy === option) {
            return sortOrder === "asc" ? faSortUp : faSortDown
        }
        return faSort
    }

    const getSortButtonClass = (option) => {
        return `sort-button ${sortBy === option ? "active" : ""}`
    }

    return (
        <div className="sorting-controls">
            <div className="sorting-section">
                <div className="section-header">
                    <FontAwesomeIcon icon={faSort} className="section-icon" />
                    <span className="section-title">Sort by</span>
                </div>

                <div className="sort-buttons">
                    {sortOptions.map((option) => (
                        <button
                            key={option.value}
                            className={getSortButtonClass(option.value)}
                            onClick={() => handleSortChange(option.value)}
                            title={`Sort by ${option.label} (${sortBy === option.value ? (sortOrder === "asc" ? "Ascending" : "Descending") : "Click to sort"})`}
                        >
                            <FontAwesomeIcon icon={option.icon} className="sort-option-icon" />
                            <span className="sort-label">{option.label}</span>
                            <FontAwesomeIcon icon={getSortIcon(option.value)} className="sort-direction-icon" />
                        </button>
                    ))}
                </div>
            </div>

            <div className="grouping-section">
                <div className="section-header">
                    <FontAwesomeIcon icon={faLayerGroup} className="section-icon" />
                    <span className="section-title">Group by</span>
                </div>

                <select className="group-select" value={groupBy} onChange={(e) => dispatch(setGroupBy(e.target.value))}>
                    {groupOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="current-settings">
                <div className="setting-item">
                    <strong>Sort:</strong> {sortOptions.find((opt) => opt.value === sortBy)?.label}
                    <span className="sort-order">({sortOrder === "asc" ? "↑" : "↓"})</span>
                </div>
                {groupBy !== "none" && (
                    <div className="setting-item">
                        <strong>Group:</strong> {groupOptions.find((opt) => opt.value === groupBy)?.label}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SortingControls
