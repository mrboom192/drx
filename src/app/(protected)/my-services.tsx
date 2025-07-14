import ListPage from "@/components/ListPage";
import ServiceListItem from "@/components/ServiceListItem";
import { useTranslation } from "react-i18next";
import { getServicesList } from "@/constants/options";
import { usePublicProfile } from "@/stores/usePublicProfileStore";

const MyServicesPage = () => {
  const { t } = useTranslation();
  const publicProfile = usePublicProfile();
  const services = publicProfile?.services || [];

  return (
    <ListPage
      data={getServicesList(t)}
      renderItem={({ item }) => {
        const isEnabled = services.includes(item.id);

        return (
          <ServiceListItem
            id={item.id}
            title={item.title}
            description={item.description}
            price={publicProfile?.[item.priceLabel]}
            isEnabled={isEnabled}
          />
        );
      }}
    />
  );
};

export default MyServicesPage;
