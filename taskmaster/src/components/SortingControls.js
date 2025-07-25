"use client"

import { useState, useRef, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faSort,
    faArrowUpAZ,
    faArrowDownZA,
    faLayerGroup,
    faChevronDown,
    faCalendarAlt,
    faFont,
    faBars,
    faFlag,
    faClock,
} from "@fortawesome/free-solid-svg-icons"
import { setSortBy, setGroupBy, toggleSortOrder } from "../store/todoSlice"

const SortingControls = () => {
    const dispatch = useDispatch()
    const { sortBy, sortOrder, groupBy } = useSelector((state) => state.todos)

    const [showSortDropdown, setShowSortDropdown] = useState(false)
    const [showGroupDropdown, setShowGroupDropdown] = useState(false)

    const sortDropdownRef = useRef(null)
    const groupDropdownRef = useRef(null)

    const sortOptions = [
        { value: "priority", label: "Priority", icon: faFlag },
        { value: "dateCreated", label: "Date Created", icon: faCalendarAlt },
        { value: "dateModified", label: "Date Modified", icon: faClock },
        { value: "name", label: "Name", icon: faFont },
    ]

    const groupOptions = [
        { value: "none", label: "No Grouping", icon: faBars },
        { value: "priority", label: "Priority", icon: faFlag },
        { value: "dateCreated", label: "Date Created", icon: faCalendarAlt },
        { value: "dateModified", label: "Date Modified", icon: faClock },
        { value: "name", label: "Name", icon: faFont },
    ]

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
                setShowSortDropdown(false)
            }
            if (groupDropdownRef.current && !groupDropdownRef.current.contains(event.target)) {
                setShowGroupDropdown(false)
            }
        }

        // Close dropdowns on scroll to prevent positioning issues
        const handleScroll = () => {
            setShowSortDropdown(false)
            setShowGroupDropdown(false)
        }

        // Close dropdowns on window resize
        const handleResize = () => {
            setShowSortDropdown(false)
            setShowGroupDropdown(false)
        }

        document.addEventListener("mousedown", handleClickOutside)
        window.addEventListener("scroll", handleScroll, true)
        window.addEventListener("resize", handleResize)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            window.removeEventListener("scroll", handleScroll, true)
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    const handleSortSelect = (newSortBy) => {
        dispatch(setSortBy(newSortBy))
        setShowSortDropdown(false)
    }

    const handleOrderToggle = () => {
        dispatch(toggleSortOrder())
    }

    const handleGroupSelect = (newGroupBy) => {
        dispatch(setGroupBy(newGroupBy))
        setShowGroupDropdown(false)
    }

    const getCurrentSortOption = () => {
        return sortOptions.find((option) => option.value === sortBy) || sortOptions[0]
    }

    const getCurrentGroupOption = () => {
        return groupOptions.find((option) => option.value === groupBy) || groupOptions[0]
    }

    // Add smart positioning logic
    const handleSortToggle = () => {
        setShowGroupDropdown(false) // Close other dropdown
        setShowSortDropdown(!showSortDropdown)
    }

    const handleGroupToggle = () => {
        setShowSortDropdown(false) // Close other dropdown
        setShowGroupDropdown(!showGroupDropdown)
    }

    return (
        <div className="sorting-toolbar">
            <div className="toolbar-section">
                <span className="toolbar-label">Sort & Filter</span>

                <div className="toolbar-controls">
                    {/* Sort Dropdown */}
                    <div className="control-group" ref={sortDropdownRef}>
                        <button className="toolbar-button sort-button" onClick={handleSortToggle} title="Sort by">
                            <FontAwesomeIcon icon={faSort} className="button-icon" />
                            <span className="button-text">{getCurrentSortOption().label}</span>
                            <FontAwesomeIcon icon={faChevronDown} className="dropdown-arrow" />
                        </button>

                        {showSortDropdown && (
                            <div className="dropdown-menu sort-dropdown">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        className={`dropdown-item ${sortBy === option.value ? "active" : ""}`}
                                        onClick={() => handleSortSelect(option.value)}
                                    >
                                        <FontAwesomeIcon icon={option.icon} className="item-icon" />
                                        <span className="item-text">{option.label}</span>
                                        {sortBy === option.value && <div className="active-indicator"></div>}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Order Toggle */}
                    <button
                        className="toolbar-button order-button"
                        onClick={handleOrderToggle}
                        title={`Sort ${sortOrder === "asc" ? "Ascending" : "Descending"} - Click to toggle`}
                    >
                        <FontAwesomeIcon icon={sortOrder === "asc" ? faArrowUpAZ : faArrowDownZA} className="button-icon" />
                        <span className="button-text">{sortOrder === "asc" ? "A-Z" : "Z-A"}</span>
                    </button>

                    {/* Group Dropdown */}
                    <div className="control-group" ref={groupDropdownRef}>
                        <button className="toolbar-button group-button" onClick={handleGroupToggle} title="Group by">
                            <FontAwesomeIcon icon={faLayerGroup} className="button-icon" />
                            <span className="button-text">{getCurrentGroupOption().label}</span>
                            <FontAwesomeIcon icon={faChevronDown} className="dropdown-arrow" />
                        </button>

                        {showGroupDropdown && (
                            <div className="dropdown-menu group-dropdown">
                                {groupOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        className={`dropdown-item ${groupBy === option.value ? "active" : ""}`}
                                        onClick={() => handleGroupSelect(option.value)}
                                    >
                                        <FontAwesomeIcon icon={option.icon} className="item-icon" />
                                        <span className="item-text">{option.label}</span>
                                        {groupBy === option.value && <div className="active-indicator"></div>}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Status Indicator */}
            <div className="sort-status">
        <span className="status-text">
          Sorted by <strong>{getCurrentSortOption().label}</strong>
            {sortOrder === "asc" ? " ↑" : " ↓"}
            {groupBy !== "none" && (
                <span>
              {" "}
                    • Grouped by <strong>{getCurrentGroupOption().label}</strong>
            </span>
            )}
        </span>
            </div>
        </div>
    )
}

export default SortingControls
