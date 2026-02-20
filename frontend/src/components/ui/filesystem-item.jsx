"use client"

import { useState, useRef } from "react"
import { ChevronRight, Folder, File, Trash2, RefreshCw } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

export function FilesystemItem({ node, animated = false, onDelete, onUpdate }) {
    const [isOpen, setIsOpen] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const updateInputRef = useRef(null)

    const isFolder = node.nodes && node.nodes.length > 0
    const isFile = !node.nodes

    const handleDelete = async (e) => {
        e.stopPropagation()
        if (!confirmDelete) {
            setConfirmDelete(true)
            setTimeout(() => setConfirmDelete(false), 3000) // Reset after 3s
            return
        }
        setIsDeleting(true)
        if (onDelete) await onDelete(node.name)
        setIsDeleting(false)
        setConfirmDelete(false)
    }

    const handleUpdateClick = (e) => {
        e.stopPropagation()
        updateInputRef.current?.click()
    }

    const handleUpdateFile = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setIsUpdating(true)
        if (onUpdate) await onUpdate(node.name, file)
        setIsUpdating(false)
        e.target.value = '' // Reset input
    }

    const ChevronIcon = () =>
        animated ? (
            <motion.span
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="flex"
            >
                <ChevronRight className="size-4 text-[var(--text-tertiary)]" />
            </motion.span>
        ) : (
            <ChevronRight
                className={`size-4 text-[var(--text-tertiary)] ${isOpen ? "rotate-90" : ""}`}
            />
        )

    const ChildrenList = () => {
        const children = node.nodes?.map((child) => (
            <FilesystemItem
                node={child}
                key={child.name}
                animated={animated}
                onDelete={onDelete}
                onUpdate={onUpdate}
            />
        ))

        if (animated) {
            return (
                <AnimatePresence>
                    {isOpen && (
                        <motion.ul
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                            className="pl-5 overflow-hidden flex flex-col justify-end"
                        >
                            {children}
                        </motion.ul>
                    )}
                </AnimatePresence>
            )
        }

        return isOpen && <ul className="pl-5">{children}</ul>
    }

    return (
        <li className="list-none">
            <span className="filesystem-item-row flex items-center gap-1.5 py-1 cursor-pointer rounded-md px-1 transition-colors hover:bg-[var(--card-hover)]">
                {isFolder && (
                    <button onClick={() => setIsOpen(!isOpen)} className="p-0.5 -m-0.5 bg-transparent border-none cursor-pointer">
                        <ChevronIcon />
                    </button>
                )}

                {node.nodes ? (
                    <Folder
                        className={`size-[18px] text-[var(--accent-color)] fill-[var(--accent-light)] ${node.nodes.length === 0 ? "ml-[22px]" : ""
                            }`}
                    />
                ) : (
                    <File className="ml-[22px] size-[18px] text-[var(--text-secondary)]" />
                )}
                <span className="text-[0.8125rem] text-[var(--text-primary)] font-medium truncate flex-1">
                    {node.name}
                </span>

                {/* Action buttons for files only */}
                {isFile && (
                    <span className="file-actions-inline" onClick={(e) => e.stopPropagation()}>
                        <input
                            ref={updateInputRef}
                            type="file"
                            accept=".txt,.pdf"
                            onChange={handleUpdateFile}
                            style={{ display: 'none' }}
                        />
                        <button
                            className="file-action-btn update-btn"
                            onClick={handleUpdateClick}
                            title="Replace file"
                            disabled={isUpdating}
                        >
                            <RefreshCw size={13} className={isUpdating ? 'spin-animation' : ''} />
                        </button>
                        <button
                            className={`file-action-btn delete-btn ${confirmDelete ? 'confirm' : ''}`}
                            onClick={handleDelete}
                            title={confirmDelete ? "Click again to confirm" : "Delete file"}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <RefreshCw size={13} className="spin-animation" />
                            ) : (
                                <Trash2 size={13} />
                            )}
                        </button>
                    </span>
                )}
            </span>

            <ChildrenList />
        </li>
    )
}
