"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import BannerServices from "../services/BannerSevice"
import { Plus, Search, MoreVertical, Eye, EyeOff, Calendar, LinkIcon, X } from "lucide-react"

const BannerList = () => {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    image: "",
    status: "hidden",
    startDate: "",
    endDate: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const itemsPerPage = 5

  const [showActionMenu, setShowActionMenu] = useState(null)
  const [selectedBanner, setSelectedBanner] = useState(null)

  const navigate = useNavigate()

  const [viewImageModal, setViewImageModal] = useState(false)
  const [currentImage, setCurrentImage] = useState({ url: "", title: "" })

  const handleViewImage = (url, title) => {
    setCurrentImage({ url, title })
    setViewImageModal(true)
  }

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const response = await BannerServices.getAllBanners({
          page: currentPage,
          size: itemsPerPage,
          status: statusFilter,
          search: searchQuery,
        })
        setBanners(response.banners)
        setTotalPages(response.totalPages)
      } catch (error) {
        console.error("Error loading banners:", error)
      } finally {
        setLoading(false)
      }
    }

    loadBanners()
  }, [currentPage, statusFilter, searchQuery])

  const handleViewDetails = (bannerId) => {
    navigate(`/main/banners/${bannerId}`)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddBanner = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      await BannerServices.createBanner(formData)

      // Show success message
      setSuccessMessage("Banner đã được tạo thành công!")
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)

      // Reset form and close modal
      setFormData({ title: "", link: "", image: "", status: "hidden", startDate: "", endDate: "" })
      setShowAddModal(false)

      // Refresh banner list
      const response = await BannerServices.getAllBanners({
        page: currentPage,
        size: itemsPerPage,
        status: statusFilter,
        search: searchQuery,
      })
      setBanners(response.banners)
    } catch (error) {
      console.error("Error adding banner:", error)
    }
  }

  const handleActionMenu = (bannerId) => {
    setShowActionMenu(showActionMenu === bannerId ? null : bannerId)
  }

  const toggleStatus = async (banner) => {
    try {
      const newStatus = banner.status === "visible" ? "hidden" : "visible"
      await BannerServices.changeStatus(banner.id, newStatus)

      // Show success message
      setSuccessMessage(`Banner đã được ${newStatus === "visible" ? "hiển thị" : "ẩn"} thành công!`)
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)

      // Refresh banner list
      const response = await BannerServices.getAllBanners({
        page: currentPage,
        size: itemsPerPage,
        status: statusFilter,
        search: searchQuery,
      })
      setBanners(response.banners)

      // Close action menu
      setShowActionMenu(null)
    } catch (error) {
      console.error("Error updating banner status:", error)
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.title) errors.title = "Tiêu đề không được để trống"
    if (!formData.link) errors.link = "Link không được để trống"
    if (!formData.image) errors.image = "URL Hình ảnh không được để trống"
    if (!formData.startDate) errors.startDate = "Thời gian bắt đầu không được để trống"
    if (!formData.endDate) errors.endDate = "Thời gian kết thúc không được để trống"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value)
    setCurrentPage(1) // Reset to first page when filtering
  }

  return (
    <div className="container p-6 mx-auto">
      {/* Success message */}
      {showSuccessMessage && (
        <div className="fixed z-50 flex items-center p-4 space-x-2 text-white bg-green-500 rounded-lg shadow-lg top-4 right-4 animate-fade-in-down">
          <span>{successMessage}</span>
          <button
            onClick={() => setShowSuccessMessage(false)}
            className="p-1 ml-2 text-white rounded-full hover:bg-green-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col items-center justify-between mb-6 md:flex-row">
        <h2 className="mb-4 text-2xl font-bold text-gray-800 md:mb-0">Quản lý Banner</h2>
        <button
          className="flex items-center px-4 bg-white border border-gray-300 rounded-xl py-2text-gray-700 hover:bg-gray-50"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-4 h-4 mr-2 " />
          Tạo Banner
        </button>
      </div>

      {/* Search and filter */}
      <div className="grid gap-4 mb-6 md:grid-cols-2">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm banner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </form>
        <select
          value={statusFilter}
          onChange={handleFilterChange}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="visible">Đang hiển thị</option>
          <option value="hidden">Đang ẩn</option>
        </select>
      </div>

      {/* Banner list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-12 h-12 border-4 rounded-full border-t-primary animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-hidden bg-white shadow-lg rounded-xl">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Hình ảnh
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Tiêu đề
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Link
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Thời gian
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {banners.length > 0 ? (
                  banners.map((banner) => (
                    <tr key={banner.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative w-20 h-12 overflow-hidden rounded-md group">
                          <img
                            src={banner.image || "/placeholder.svg"}
                            alt={banner.title}
                            className="object-cover w-full h-full"
                          />
                          <button
                            onClick={() => handleViewImage(banner.image, banner.title)}
                            className="absolute inset-0 flex items-center justify-center w-full h-full transition-opacity bg-black bg-opacity-50 opacity-0 group-hover:opacity-100"
                          >
                            <Eye className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{banner.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={banner.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {banner.link.length > 30 ? banner.link.substring(0, 30) + "..." : banner.link}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            banner.status === "visible" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {banner.status === "visible" ? (
                            <>
                              <Eye className="inline w-3 h-3 mr-1" /> Hiển thị
                            </>
                          ) : (
                            <>
                              <EyeOff className="inline w-3 h-3 mr-1" /> Ẩn
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(banner.startDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center mt-1">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(banner.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative">
                          <button
                            onClick={() => handleActionMenu(banner.id)}
                            className="p-1 text-gray-500 rounded-full hover:bg-gray-100"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          {showActionMenu === banner.id && (
                            <div className="absolute right-0 z-10 w-48 mt-1 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                              <div className="py-1">
                                <button
                                  onClick={() => handleViewDetails(banner.id)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  Xem chi tiết
                                </button>
                                <button
                                  onClick={() => toggleStatus(banner)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                >
                                  {banner.status === "visible" ? (
                                    <>
                                      <EyeOff className="w-4 h-4 mr-2" /> Ẩn banner
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="w-4 h-4 mr-2" /> Hiển thị banner
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      Không có banner nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex items-center justify-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Trước
          </button>
          <div className="flex items-center justify-center w-10 h-8 font-medium rounded-md text-primary bg-primary/10">
            {currentPage}
          </div>
          <span className="text-gray-500">của {totalPages}</span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Tiếp
          </button>
        </div>
      )}

      {/* Add Banner Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-2xl p-6 mx-4 bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Tạo Banner Mới</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-gray-500 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBanner} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Nhập tiêu đề banner"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    formErrors.title ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.title && <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Link <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <LinkIcon className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="text"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                    className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      formErrors.link ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {formErrors.link && <p className="mt-1 text-sm text-red-500">{formErrors.link}</p>}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  URL Hình ảnh <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    formErrors.image ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.image && <p className="mt-1 text-sm text-red-500">{formErrors.image}</p>}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Thời gian bắt đầu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      formErrors.startDate ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.startDate && <p className="mt-1 text-sm text-red-500">{formErrors.startDate}</p>}
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Thời gian kết thúc <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      formErrors.endDate ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.endDate && <p className="mt-1 text-sm text-red-500">{formErrors.endDate}</p>}
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Trạng thái</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="visible">Đang hiển thị</option>
                  <option value="hidden">Đang ẩn</option>
                </select>
              </div>

              <div className="flex items-center justify-end pt-4 space-x-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Tạo Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Image Modal */}
      {viewImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative max-w-4xl max-h-[90vh] overflow-auto bg-white rounded-lg">
            <div className="sticky top-0 flex items-center justify-between p-4 bg-white border-b">
              <h3 className="text-lg font-medium">{currentImage.title}</h3>
              <button
                onClick={() => setViewImageModal(false)}
                className="p-1 text-gray-500 rounded-full hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={currentImage.url || "/placeholder.svg"}
                alt={currentImage.title}
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BannerList

