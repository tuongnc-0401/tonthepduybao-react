import { useState, useEffect } from 'react'
import { Modal } from 'antd'
import { isNil } from 'lodash'
import { useMoment } from '~/composables'
import { formatCurrency, windowPrint } from '~/modules/utils'

export default function PrintInvoiceModal({ invoice = null, onClose }) {
  const moment = useMoment()
  const isShowModal = !isNil(invoice)

  if (!isShowModal || !invoice) return null

  const totalInvoicePrice = invoice.invoiceProducts
    .map((item) => item.quantity * item.unitPrice)
    .reduce((a, b) => a + b, 0)

  const printContainerId = 'printInvoiceContainer'

  const print = () =>
    windowPrint(document.querySelector(`#${printContainerId}`).innerHTML)

  const printStyles = `
    .print-container {
      min-width: calc(148px * 4);
      max-width: calc(148px * 5);
      min-height: calc(210px * 3);
      max-height: calc(210px * 5);
      margin: auto;
    }
    ul { margin: 0; list-style-type: none; padding: 0; }
    ul li { margin-bottom: 0.15em; }
    .pi-section1 { display: flex; justify-content: space-between; }
    .pi-section1 h3 { font-weight: 600; }
    .pi-section1 .logo { display: flex; align-items: center; margin-bottom: 0.5em; }
    .pi-section1 .logo img { width: 48px; }
    .pi-section2 { display: flex; align-items: center; border: solid 1px #e5e7eb; margin-top: 2em; width: 100%; }
    .pi-section2 > ul { display: flex; flex-direction: column; width: 50%; padding: 1em; }
    .pi-section2 > ul:first-child { border-right: 1px solid #e5e7eb; }
    .pi-section3 { margin-top: 1em; }
    .print-table { width: 100%; border: 1px solid #e5e7eb; border-right: none; border-bottom: none; }
    .print-table thead tr th, .print-table tbody tr td { padding: 0.25em 1em; border-right: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; text-align: center; }
    .td-total-label { padding-left: 3em !important; font-weight: 600; text-align: left !important; }
    .td-total-price { font-weight: 600; }
    .pi-section5 { width: 100%; display: flex; justify-content: space-between; margin-top: 2em; padding-bottom: 6em; }
    .pi-section5 li { width: 33%; text-align: center; font-weight: 600; }
  `

  return (
    <Modal
      open={isShowModal}
      centered
      width={780}
      title="In hoá đơn"
      okText="In hoá đơn"
      cancelText="Đóng"
      onOk={print}
      onCancel={onClose}
    >
      <div id={printContainerId}>
        <style>{printStyles}</style>
        <div className="print-container">
          <div className="pi-section1">
            <div>
              <div className="logo">
                <img src="/img/single-logo.png" alt="ttdb" />
                <h3>Tôn Thép Duy Bảo</h3>
              </div>
              <ul>
                <li>CN1: 80 đường 5, LX, TĐ - 0939922078</li>
                <li>CN2: 63 Hoàng Hữu Nam, TPss TĐ - 0937658178</li>
                <li>CN3: 190 Nguyễn Văn Tăng, L.Tr, TĐ - 0906658178</li>
              </ul>
            </div>
            <div>
              <h3>Phiếu Báo Giá</h3>
              <ul>
                <li>Số: {invoice.id}/{invoice.date.substring(4)}</li>
                <li>Ngày {moment.dFormat(invoice.date)}</li>
              </ul>
            </div>
          </div>

          <div className="pi-section2">
            <ul>
              <li>Khách hàng: {invoice.customer.name}</li>
              <li>Thông tin giao hàng</li>
              <li><span>Người nhận:</span> {invoice.shippingAddress.name}</li>
              <li><span>Số ĐT:</span> {invoice.shippingAddress.phone}</li>
              <li><span>Địa chỉ:</span> {invoice.shippingAddress.address}</li>
            </ul>
            <ul>
              <li>TRẦN VĂN GIAI</li>
              <li>26676678 - ACB - Chi nhánh TĐ</li>
              <li>NGUYỄN THỊ NGỌC THUỶ</li>
              <li>6302205314223 - Agribank</li>
            </ul>
          </div>

          <div className="pi-section3">
            <p>Công ty trân trọng báo giá các mặt hàng sau:</p>
            <table className="print-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên hàng</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {invoice.invoiceProducts.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.product.name}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.unitPrice)}</td>
                    <td>{formatCurrency(item.quantity * item.unitPrice)}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={4} className="td-total-label">Tổng cộng:</td>
                  <td colSpan={1} className="td-total-price">{formatCurrency(totalInvoicePrice)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="pi-section4" style={{ marginTop: '1em' }}>
            <p style={{ marginBottom: '0.5em', fontStyle: 'italic', fontWeight: 600 }}>Ghi chú:</p>
            <ul style={{ padding: '0 0 0 3em' }}>
              <li>- Quý khách kiểm trang hàng trước khi nhận hàng.</li>
              <li>- Quý khách bảo quản hàng nơi khô ráo, vệ sinh mặt sắt.</li>
              <li>- Hoá đơn GTGT có giá trị 07 ngày kể từ ngày mua hàng.</li>
            </ul>
          </div>

          <ul className="pi-section5">
            <li>Người nhận hàng</li>
            <li>Người giao hàng</li>
            <li>Người lập phiếu</li>
          </ul>
        </div>
      </div>
    </Modal>
  )
}
