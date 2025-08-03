import React from 'react'
import { FiX, FiPrinter } from 'react-icons/fi'

export default function OrderViewModal({ order, onClose }) {
  const handlePrint = () => {
    const printContent = document.getElementById('invoice-content')
    const originalContent = document.body.innerHTML
    
    document.body.innerHTML = printContent.innerHTML
    window.print()
    document.body.innerHTML = originalContent
    window.location.reload()
  }

  const generatePDF = async () => {
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank')
      
      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice - ${order.transactionId}</title>
          <style>
            @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600;700&display=swap");

            :root {
              --bg-clr: #fef7ed;
              --white: #fff;
              --invoice-bg: #f8fafc;
              --primary-clr: #1e3a8a;
              --gold-clr: #d97706;
              --slate-clr: #64748b;
            }

            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              font-family: "Inter", sans-serif;
            }

            body {
              background: var(--bg-clr);
              font-size: 14px;
              line-height: 1.6;
              color: var(--primary-clr);
              padding: 0 20px;
            }

            .main_title{
              font-weight: 700;
              font-size: 18px;
              color: var(--primary-clr);
              margin-bottom: 12px;
              font-family: "Playfair Display", serif;
            }

            .p_title {
              font-weight: 600;
              font-size: 16px;
              color: var(--primary-clr);
            }

            .p_title > span{
              font-weight: 400;
              font-size: 14px;
              color: var(--slate-clr);
            }

            .text_right {
              text-align: right;
            }

            .text_center {
              text-align: center;
            }

            .i_row{
              display: flex;
            }

            .invoice {
              width: 800px;
              max-width: 100%;
              height: auto;
              background: var(--white);
              margin: 20px auto;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 10px 25px rgba(30, 58, 138, 0.1);
            }

            .invoice > div{
              width: 100%;
              padding: 40px;
            }

            .invoice .invoice_info .i_row,
            .invoice .invoice_payment .i_row{
              justify-content: space-between;
            }

            .invoice .invoice_info,
            .invoice .invoice_terms,
            .invoice .invoice_payment{
              background: var(--invoice-bg);
            }

            .invoice .invoice_payment{
              border-bottom: 2px solid var(--gold-clr);
            }

            .invoice .invoice_info > div:not(:last-child){
              margin-bottom: 40px;
            } 

            .invoice .invoice_info h1{
              font-size: 42px;
              line-height: 1.2;
              color: var(--primary-clr);
              font-family: "Playfair Display", serif;
              font-weight: 700;
            }

            .invoice .w_15 {
              width: 15%;
            }

            .invoice .w_50 {
              width: 50%;
            }

            .invoice .w_55 {
              width: 55%;
            }

            .invoice .i_table .i_row {
              padding: 16px 12px; 
              border: 2px solid var(--gold-clr); 
              border-bottom: 0;
            }

            .invoice .i_table .i_table_foot .i_row:last-child{
              border-bottom: 2px solid var(--gold-clr);  
            }

            .invoice .i_table .i_row p{
              margin: 0;
              font-weight: 600;
              color: var(--primary-clr);
            }

            .invoice .i_table .i_table_head .i_row,
            .invoice .i_table .i_table_foot .grand_total_wrap{
              background: var(--primary-clr);
              color: white;
            }

            .invoice .i_table .i_table_head .i_row p,
            .invoice .i_table .i_table_foot .grand_total_wrap p{
              color: white;
            }

            .invoice .invoice_right .terms{
              margin: 0;
            }

            /* Print Styles */
            @media print {
              body { background: white; padding: 0; }
              .invoice { margin: 0; box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <section>
            <div class="invoice">
              <div class="invoice_info">
                <div class="i_row">
                  <div class="i_logo">
                    <h1 style="color: var(--gold-clr);">BEEJA ACADEMY</h1>
                  </div>
                  <div class="title">
                    <h1>INVOICE</h1>
                  </div>
                </div>
                <div class="i_row">
                  <div class="i_to">
                    <div class="main_title">
                      <p>Invoice To</p>
                    </div>
                    <div class="p_title">
                      <p>${`${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim() || 'N/A'}</p>
                      <span>Student</span>
                    </div>
                    <div class="p_title">
                      <p>${order.user?.email || 'N/A'}</p>
                      <p>${order.user?.additionalDetails?.contactNumber || 'N/A'}</p>
                    </div>
                  </div>
                  <div class="i_details text_right">
                    <div class="main_title">
                      <p>Invoice Details</p>
                    </div>
                    <div class="p_title">
                      <p>Invoice No:</p>
                      <span>INV-${order._id.slice(-8).toUpperCase()}</span>
                    </div>
                    <div class="p_title">
                      <p>Invoice Date:</p>
                      <span>${new Date(order.purchaseDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="invoice_table">
                <div class="i_table">
                  <div class="i_table_head">
                    <div class="i_row">
                      <div class="i_col w_55">
                        <p class="p_title">DESCRIPTION</p>
                      </div>
                      <div class="i_col w_15 text_center">
                        <p class="p_title">QTY</p>
                      </div>
                      <div class="i_col w_15 text_center">
                        <p class="p_title">PRICE</p>
                      </div>
                      <div class="i_col w_15 text_right">
                        <p class="p_title">TOTAL</p>
                      </div>
                    </div>
                  </div>
                  <div class="i_table_body">
                    <div class="i_row">
                      <div class="i_col w_55">
                        <p>${order.course?.courseName || 'N/A'}</p>
                        <span>Lifetime Access • Digital Course • Instructor: ${order.course?.instructor?.firstName || 'DineshKumar'}</span>
                      </div>
                      <div class="i_col w_15 text_center">
                        <p>1</p>
                      </div>
                      <div class="i_col w_15 text_center">
                        <p>${order.amount === 0 ? 'Free' : `Rs. ${order.amount}`}</p>
                      </div>
                      <div class="i_col w_15 text_right">
                        <p>${order.amount === 0 ? 'Free' : `Rs. ${order.amount}`}</p>
                      </div>
                    </div>
                  </div>
                  <div class="i_table_foot">
                    <div class="i_row">
                      <div class="i_col w_50">
                        <p>Sub Total</p>
                        ${(order.couponUsed?.code || order.discountAmount > 0) ? '<p>Discount</p>' : ''}
                      </div>
                      <div class="i_col w_50 text_right">
                        <p>${order.originalPrice > 0 ? `Rs. ${order.originalPrice}` : (order.amount === 0 ? 'Free' : `Rs. ${order.amount}`)}</p>
                        ${(order.couponUsed?.discountAmount > 0 || order.discountAmount > 0) ? `<p style="color: #059669;">Rs. ${((order.couponUsed?.discountAmount || 0) + (order.discountAmount || 0)).toFixed(2)}</p>` : ''}
                      </div>
                    </div>
                    <div class="i_row grand_total_wrap">
                      <div class="i_col w_50">
                        <p>GRAND TOTAL:</p>
                      </div>
                      <div class="i_col w_50 text_right">
                        <p>${order.amount === 0 ? 'Free' : `Rs. ${order.amount}`}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="invoice_payment">
                <div class="i_row">
                  <div class="i_payment">
                    <div class="main_title">
                      <p>Payment Method</p>
                    </div>
                    <div class="p_title">
                      <p>Payment Method:</p>
                      <span>${order.paymentMethod}</span>
                    </div>
                    <div class="p_title">
                      <p>Transaction ID:</p>
                      <span>${order.transactionId}</span>
                    </div>
                  </div>
                  <div class="i_duetotal text_right">
                    <div class="main_title">
                      <p>Payment Status</p>
                    </div>
                    <div class="p_title">
                      <p>Status:</p>
                      <span style="color: #059669;">✓ Paid</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="invoice_terms">
                <div class="main_title">
                  <p>Company Information</p>
                </div>
                <p><strong>Beeja Academy</strong> - Excellence in Education<br>
                Contact: DineshKumar | Phone: +91 9585113955 | Email: dinesh@beejaacademy.com<br>
                Website: www.beejaacademy.com<br><br>
                Thank you for choosing Beeja Academy! This is a computer-generated invoice.</p>
              </div>
            </div>
          </section>
        </body>
        </html>
      `;
      
      printWindow.document.write(invoiceHTML);
      printWindow.document.close();
      printWindow.focus();
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    } catch (error) {
      console.error('Error generating PDF:', error)
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] grid place-items-center overflow-auto bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="w-11/12 max-w-4xl rounded-2xl border border-academic-slate-300 bg-white shadow-elegant">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-academic-slate-200 p-6">
          <h2 className="classic-heading text-2xl">Order Invoice</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={generatePDF}
              className="btn-elegant flex items-center gap-2"
            >
              <FiPrinter className="w-4 h-4" />
              Print Invoice
            </button>
            <button
              onClick={onClose}
              className="p-2 text-academic-slate-500 hover:text-academic-slate-700 rounded-lg hover:bg-academic-slate-100 transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div id="invoice-content" className="p-6">
          {/* Modern Header with Logo */}
          <div className="bg-gradient-to-r from-academic-navy-700 to-academic-navy-800 p-8 rounded-xl text-center relative overflow-hidden mb-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-4xl">🎓</div>
              <div className="text-3xl font-bold text-academic-gold-400 font-playfair">Beeja Academy</div>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 tracking-wider font-playfair">INVOICE</h1>
            <p className="text-academic-slate-200 text-lg">
              Date: {new Date(order.purchaseDate).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-academic-gold-500 to-academic-gold-600"></div>
          </div>

          {/* From/To Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="classic-card p-6 border-l-4 border-academic-gold-500">
              <h3 className="elegant-heading mb-4 flex items-center gap-2">
                <span className="text-blue-600">🏢</span> Bill From:
              </h3>
              <div className="space-y-2">
                <p className="font-bold text-academic-navy-900 text-lg font-playfair">Beeja Academy</p>
                <p className="text-academic-slate-600">DineshKumar</p>
                <p className="text-academic-slate-600">📞 +91 9585113955</p>
                <p className="text-academic-slate-600">✉️ dinesh@beejaacademy.com</p>
                <p className="text-academic-slate-600">🌐 www.beejaacademy.com</p>
              </div>
            </div>
            <div className="classic-card p-6 border-l-4 border-green-500">
              <h3 className="elegant-heading mb-4 flex items-center gap-2">
                <span className="text-green-600">👤</span> Bill To:
              </h3>
              <div className="space-y-2">
                <p className="font-bold text-academic-navy-900 text-lg font-playfair">
                  {`${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim() || 'N/A'}
                </p>
                <p className="text-academic-slate-600">📞 {order.user?.additionalDetails?.contactNumber || 'N/A'}</p>
                <p className="text-academic-slate-600">✉️ {order.user?.email || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="classic-card p-6 mb-8">
            <h3 className="elegant-heading mb-4">Order Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="font-semibold text-academic-slate-600">Order ID:</span>
                <span className="text-academic-navy-900 font-mono">{order._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-academic-slate-600">Transaction ID:</span>
                <span className="text-academic-navy-900 font-mono">{order.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-academic-slate-600">Payment Method:</span>
                <span className="text-academic-navy-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-academic-slate-600">Currency:</span>
                <span className="text-academic-navy-900">INR</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-academic-slate-600">Payment Status:</span>
                <span className="text-green-700 font-semibold">✓ Received</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-academic-slate-600">Enrollment Date:</span>
                <span className="text-academic-navy-900">
                  {new Date(order.purchaseDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Course Details */}
          <div className="classic-card p-6 mb-8">
            <h3 className="elegant-heading mb-6 flex items-center gap-2">
              <span className="text-academic-gold-600">📚</span> Course Details
            </h3>
            <div className="overflow-hidden rounded-xl border border-academic-slate-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-academic-navy-700">
                    <th className="p-4 text-left text-sm font-bold text-white">Course Name</th>
                    <th className="p-4 text-left text-sm font-bold text-white">Instructor</th>
                    <th className="p-4 text-right text-sm font-bold text-white">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-academic-slate-200 bg-academic-cream-50">
                    <td className="p-4">
                      <div>
                        <p className="font-semibold text-academic-navy-900">{order.course?.courseName || 'N/A'}</p>
                        <p className="text-sm text-academic-slate-600">Lifetime Access</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-academic-navy-900 font-medium">{order.course?.instructor?.firstName || 'DineshKumar'}</p>
                        <p className="text-sm text-academic-slate-600">{order.course?.instructor?.email || 'dinesh@beejaacademy.com'}</p>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <p className="font-bold text-academic-gold-700 text-lg">{order.amount === 0 ? 'Free' : `₹${order.amount}`}</p>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t border-academic-slate-300 bg-academic-navy-700">
                    <td colSpan="2" className="p-4 text-right font-bold text-white">Total Amount:</td>
                    <td className="p-4 text-right">
                      <p className="text-xl font-bold text-academic-gold-400">{order.amount === 0 ? 'Free' : `₹${order.amount}`}</p>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="classic-card p-8 text-center border-t-4 border-academic-gold-500">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <p className="text-xl font-bold text-academic-navy-900 mb-2 font-playfair">Thank you for choosing Beeja Academy!</p>
                <p className="text-academic-slate-600">Your trust in our educational platform means a lot to us.</p>
              </div>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-academic-gold-600">📧</span>
                  <a href="mailto:dinesh@beejaacademy.com" className="text-academic-navy-700 hover:text-academic-navy-900 transition-colors font-medium">
                    dinesh@beejaacademy.com
                  </a>
                </div>
                <div className="hidden md:block text-academic-slate-400">|</div>
                <div className="flex items-center gap-2">
                  <span className="text-academic-gold-600">📱</span>
                  <a href="tel:+919585113955" className="text-academic-navy-700 hover:text-academic-navy-900 transition-colors font-medium">
                    +91 9585113955
                  </a>
                </div>
              </div>

              <p className="text-sm text-academic-slate-500">
                This is a computer-generated invoice. No signature is required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
