package strata;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import uk.co.cdl.model.context.Context;
import uk.co.cdl.model.party.ClientSearchDetail;
import uk.co.cdl.service.party.v11.ClientSearch;
import uk.co.cdl.service.party.v11.ClientSearchResponse;
import uk.co.cdl.service.strataintegration.v11.StrataIntegrationPortType;
import uk.co.cdl.service.strataintegration.v11.StrataIntegrationServiceV11;
import uk.co.cdl.service.strataintegration.v11.WebServiceException;
import uk.co.kfis.tests.DataConstants;

@Path("search")
public class WebClient {
	
	Context strataContext;
	StrataIntegrationPortType port;
	
	public WebClient() {
		/*
		 * Initialise Context
		 */
		strataContext = new Context();
		strataContext.setBranchCode(DataConstants.Context.BRANCH_CODE);
		strataContext.setOperatorLoginName(DataConstants.Context.STRATA_OPERATOR_UAT);
		//c.setPartyID(partyId);
		//c.setPolicyID(policyId);
		//c.setSchemeCode("BB");//BG PC BB No type // KW S6 AX IS AJ V8 ORA-02291: integrity constraint (KFIS0_TEST.FK_BSEVT_POL) violated - parent key not found
		strataContext.setSchemeGroup(DataConstants.Context.SCHEME_GROUP_PC);
		strataContext.setSourceOfBusiness(DataConstants.Context.SOURCE_OF_ENQUIRY_WEB);
		
		/*
		 * Initialise Proxy
		 */
		StrataIntegrationServiceV11 service = new StrataIntegrationServiceV11();
		port = service.getStrataIntegrationPortV11();
	}

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public List<ClientSearchDetail> json(ClientSearch req) {
		//String output = request.getClientReference().toString();
		//System.out.println("Req is: " + output);
		req.setContext(strataContext);
		ClientSearchResponse res;
		try {
			res = port.clientSearch(req);
			return res.getResult();
		} catch (WebServiceException e) {
			return null;	
		}
	}
}
