"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import BannerServices from "../services/BannerSevice"
import { ArrowLeft, Calendar, LinkIcon, Eye, EyeOff, Mail, Phone, X } from "lucide-react"
function translateStatus(status) {
  const statusMap = {
    active: "Đang hoạt động",
    suspended: "Đình chỉ",
  };
  return statusMap[status] || status;
}
const BannerDetail = () => {
  const { id } = useParams()
  const [banner, setBanner] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [viewImageModal, setViewImageModal] = useState(false)

  useEffect(() => {
    const loadBannerDetails = async () => {
      try {
        const bannerData = await BannerServices.getBanner(id)
        setBanner(bannerData)
      } catch (error) {
        console.error("Error loading banner details:", error)
      } finally {
        setLoading(false)
      }
    }

    loadBannerDetails()
  }, [id])

  const handleGoBack = () => {
    navigate("/main/banners")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 rounded-full border-t-primary animate-spin" />
      </div>
    )
  }

  if (!banner) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="p-4 text-red-500 bg-red-100 rounded-lg">
          <p className="text-lg font-medium">Không tìm thấy banner này.</p>
        </div>
        <button
          type="button"
          onClick={handleGoBack}
          className="flex items-center px-4 py-2 text-white transition-colors rounded-md bg-primary hover:bg-primary/90"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </button>
      </div>
    )
  }

  const { title, link, status, startDate, endDate, image, shop } = banner

  return (
    <div className="container max-w-5xl p-6 mx-auto">
      <button
        type="button"
        onClick={handleGoBack}
        className="flex items-center px-4 py-2 mb-8 text-white transition-colors rounded-md bg-primary hover:bg-primary/90"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại
      </button>

      <div className="overflow-hidden bg-white shadow-lg rounded-xl">
        <div className="relative w-full h-64 overflow-hidden">
          <img src={image || "/placeholder.svg"} alt={title} className="object-cover w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <button
            type="button"
            onClick={() => setViewImageModal(true)}
            className="absolute p-2 text-white transition-colors rounded-full top-4 right-4 bg-black/50 hover:bg-black/70"
          >
            <Eye className="w-5 h-5" />
          </button>
          <div className="absolute bottom-0 left-0 p-6">
            <h1 className="text-3xl font-bold text-white">{title}</h1>
            <div className="flex items-center mt-2">
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${status === "visible" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}
              >
                {status === "visible" ? (
                  <>
                    <Eye className="inline w-3 h-3 mr-1" /> Đang hiển thị
                  </>
                ) : (
                  <>
                    <EyeOff className="inline w-3 h-3 mr-1" /> Đang ẩn
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-gray-50">
                <h3 className="mb-4 text-lg font-semibold text-gray-800">Thông tin Banner</h3>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <LinkIcon className="w-5 h-5 mt-0.5 text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Link</p>
                      <a href={link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {link}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 mt-0.5 text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Thời gian hiển thị</p>
                      <p className="text-gray-800">
                        {new Date(startDate).toLocaleString()} - {new Date(endDate).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {shop && shop.Owner ? (
              <div className="p-4 rounded-lg bg-gray-50">
                <h3 className="mb-4 text-lg font-semibold text-gray-800">Thông tin Chủ Cửa Hàng</h3>

                <div className="flex items-center mb-4 space-x-4">
                  <img
                    src={shop.Owner.avatar || "/placeholder.svg"}
                    alt={shop.Owner.fullName}
                    className="object-cover w-16 h-16 border-2 rounded-full border-primary/20"
                  />
                  <div>
                    <p className="text-lg font-medium">{shop.Owner.fullName}</p>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${shop.Owner.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        }`}
                    >{translateStatus(shop.Owner.status)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    <p>{shop.Owner.userEmail}</p>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    <p>{shop.Owner.userPhone}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 text-red-500 rounded-lg bg-red-50">
                <p>Thông tin chủ cửa hàng không có sẵn</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* View Image Modal */}
      {viewImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative max-w-4xl max-h-[90vh] overflow-auto bg-white rounded-lg">
            <div className="sticky top-0 flex items-center justify-between p-4 bg-white border-b">
              <h3 className="text-lg font-medium">{title}</h3>
              <button
                type="button"
                onClick={() => setViewImageModal(false)}
                className="p-1 text-gray-500 rounded-full hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <img src={image || "/placeholder.svg"} alt={title} className="max-w-full max-h-[70vh] object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BannerDetail

