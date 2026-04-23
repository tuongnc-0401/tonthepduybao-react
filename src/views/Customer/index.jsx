import { useState, useEffect } from "react";
import { Tabs, Button, Input } from "antd";
import { Icon } from "@iconify/react";
import { useMessage } from "~/composables";
import {
  CUSTOMER_TYPE,
  CUSTOMER_TYPE_KEY,
  MSG,
  PAGING,
} from "~/modules/constant";
import { useAuthStore } from "~/stores/auth";
import { useCustomerStore } from "~/stores/customer";
import CustomerTable from "~/components/pages/customers/CustomerTable";
import UpsertCustomerModal from "~/components/pages/customers/UpsertCustomerModal";
import Heading from "~/components/common/Heading";

export default function Customer() {
  const mc = useMessage();
  const authStore = useAuthStore();
  const customerStore = useCustomerStore();

  const [search, setSearch] = useState("");
  const [type, setType] = useState(CUSTOMER_TYPE_KEY.CUSTOMER);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isShowModal, setIsShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(PAGING.DEFAULT_PAGE);

  const allCustomer = customerStore.allCustomer;

  const init = async (
    activeKey,
    page = PAGING.DEFAULT_PAGE,
    pageSize = PAGING.DEFAULT_PAGE_SIZE,
  ) => {
    setCurrentPage(page);
    setType(activeKey);
    const deleted = activeKey === "DELETED";
    await customerStore.getAll({
      search,
      type: deleted ? "" : activeKey,
      deleted,
      page,
      pageSize,
    });
  };

  useEffect(() => {
    init(type, currentPage);
  }, []);

  const openModal = (customer) => {
    setSelectedCustomer(customer);
    setIsShowModal(true);
  };

  const closeModal = () => {
    setSelectedCustomer(null);
    setIsShowModal(false);
  };

  const upsertCustomer = async (payload) => {
    try {
      await customerStore.upsert(payload);
      await init(type, currentPage);
      closeModal();
      mc.success(MSG.UPDATE_SUCCESS);
    } catch {
      mc.error(MSG.UPDATE_FAILED);
    }
  };

  const deleteCustomer = async (id) => {
    await customerStore.delete(id);
    await init(type);
  };

  const undeleteCustomer = async (id) => {
    await customerStore.undelete(id);
    await init(type);
  };

  const tabItems = [
    {
      key: CUSTOMER_TYPE_KEY.CUSTOMER,
      label: `${CUSTOMER_TYPE.CUSTOMER.label} (${allCustomer?.data?.totalCustomer || 0})`,
      children: (
        <CustomerTable
          data={customerStore.getAllCustomerTableData()}
          total={allCustomer?.totalItems}
          pageSize={allCustomer?.pageSize}
          isDelete={authStore.isAdmin}
          onInit={(page) => init(type, page)}
          onEdit={openModal}
          onDelete={deleteCustomer}
        />
      ),
    },
    {
      key: CUSTOMER_TYPE_KEY.SUPPLIER,
      label: `${CUSTOMER_TYPE.SUPPLIER.label} (${allCustomer?.data?.totalSupplier || 0})`,
      children: (
        <CustomerTable
          data={customerStore.getAllCustomerTableData()}
          total={allCustomer?.totalItems}
          pageSize={allCustomer?.pageSize}
          isDelete={authStore.isAdmin}
          onInit={(page) => init(type, page)}
          onEdit={openModal}
          onDelete={deleteCustomer}
        />
      ),
    },
    {
      key: "DELETED",
      label: `Đã xoá (${allCustomer?.data?.totalDeleted || 0})`,
      children: (
        <CustomerTable
          data={customerStore.getAllCustomerTableData()}
          total={allCustomer?.totalItems}
          pageSize={allCustomer?.pageSize}
          isUndelete
          onInit={(page) => init(type, page)}
          onEdit={openModal}
          onUndelete={undeleteCustomer}
        />
      ),
    },
  ];

  return (
    <section>
      <Heading
        title={`Danh sách ${type === "DELETED" ? "bị xoá" : CUSTOMER_TYPE[type]?.label?.toLowerCase() || ""}`}
      >
        <div className="flex items-center">
          <Input.Search
            placeholder="Tìm kiếm ..."
            className="mr-4 w-[400px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onPressEnter={() => init(type, 1)}
          />
          <Button
            type="primary"
            className="flex items-center"
            onClick={() => setIsShowModal(true)}
          >
            <Icon icon="mdi:plus-circle" width="16px" />
            <span className="ml-2">Thêm thông tin</span>
          </Button>
        </div>
      </Heading>

      <Tabs
        activeKey={type}
        className="mt-8"
        items={tabItems}
        onChange={(key) => init(key)}
      />

      {isShowModal && (
        <UpsertCustomerModal
          customer={selectedCustomer}
          onSubmit={upsertCustomer}
          onClose={closeModal}
        />
      )}
    </section>
  );
}
