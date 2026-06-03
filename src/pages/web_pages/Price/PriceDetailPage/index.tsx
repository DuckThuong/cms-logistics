import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTER_PATH } from "@/routers/Route";

/** Bảng giá là một trang đơn — chuyển về editor chính. */
export const PriceDetailEditorPage = () => {
  const navigate = useNavigate();
  const { priceId = "" } = useParams<{ priceId: string }>();

  useEffect(() => {
    navigate(ROUTER_PATH.PRICE, { replace: true, state: { legacyPriceId: priceId } });
  }, [navigate, priceId]);

  return null;
};

export default PriceDetailEditorPage;
