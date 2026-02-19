"use client"

import { useState } from "react"
import { ChevronRight, Folder, File } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

export function FilesystemItem({ node, animated = false }) {
    const [isOpen, setIsOpen] = useState(false)

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
            <FilesystemItem node={child} key={child.name} animated={animated} />
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
            <span className="flex items-center gap-1.5 py-1 cursor-pointer rounded-md px-1 transition-colors hover:bg-[var(--card-hover)]">
                {node.nodes && node.nodes.length > 0 && (
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
                <span className="text-[0.8125rem] text-[var(--text-primary)] font-medium truncate">
                    {node.name}
                </span>
            </span>

            <ChildrenList />
        </li>
    )
}
