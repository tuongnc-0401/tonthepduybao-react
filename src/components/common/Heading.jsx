import { Tooltip } from 'antd'
import { Icon } from '@iconify/react'

export default function Heading({ title, subTitle, tooltip, tooltipContent, children }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex flex-col">
        <div className="flex items-center">
          {title && (
            <h2 className="text-3xl font-semibold mb-0 mr-4">{title}</h2>
          )}
          {tooltip && (
            <Tooltip
              placement="bottom"
              trigger="click"
              color="blue"
              title={tooltipContent}
              overlayClassName="min-w-[320px]"
            >
              <Icon
                icon="mdi:information-variant-circle-outline"
                width="20px"
                className="outline-none cursor-pointer"
              />
            </Tooltip>
          )}
        </div>
        {subTitle && <p className="text-xl italic text-slate-600 mb-0 m-1">{subTitle}</p>}
      </div>

      {children}
    </div>
  )
}
