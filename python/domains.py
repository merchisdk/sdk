import sdk.python.entities
from sdk.python.files import File
from sdk.python.themes import Theme
from sdk.python.menus import Menu
from sdk.python.domain_invitations import DomainInvitation
import sdk.python.util.menu_util as menu_util
from sdk.python.util.google import reconstitute_tracking_global_google_script
from sdk.python.util.google import \
    extract_tracking_global_google_script_parameters
from sdk.python.util.google import \
    reconstitute_tracking_conversion_google_script
from sdk.python.util.google import \
    extract_tracking_conversion_google_script_parameters
from sdk.python.util.brand_util import PLATFORM_MASCOT_ICON
from sdk.python.entities import Property

class Domain(sdk.python.entities.Entity):
    """ merchi python SDK object representing Domains.

        A domain originally represented only a domain in the DNS sense, being
        an entity that is allowed to use the merchi API on a website, etc.

        In newer versions, much of the system is segregated by domain.
        Products, Jobs, Categories and Managers belong to a domain, and the
        settings of the domain will impact the behaviour and options of the
        other entities that fall under it.

        Domains defer to their Company for some of their settings.

        All user login Sessions maintain an awareness of from which domain
        the user logged in. It is illegal to create a Session except via
        a website with an attached Domain that is acting as a proxy. The domain
        will authenticate itself as well as the user when asking to create
        the session.

        Methods for making requests to get information or update the domains
        settings are inherited from sdk.python.entities.Entity.
    """

    resource = '/domains/'
    json_name = 'domain'

    id = Property(int)
    active_theme_id = Property(int)
    country = Property(str)
    currency = Property(str)
    domain = Property(str)
    domain_type = Property(int)
    sub_domain = Property(str)
    email_domain = Property(str)
    theme = Property(str)
    sms_name = Property(str)
    api_secret = Property(str)
    call_to_actions = Property(str)
    call_to_action_details = Property(list)
    tracking_code_google_conversion = Property(str)
    tracking_code_google_global = Property(str)
    show_domain_to_accessible_entities_only = Property(bool)
    show_domain_publicly = Property(bool)
    enable_notifications = Property(bool)
    assign_to_agent = Property(bool)
    merchi_agent_user = Property('sdk.python.users.User')
    enable_email_notifications = Property(bool)
    enable_sms_notifications = Property(bool)
    mailgun_records = Property(list)
    webflow_api_key = Property(str)
    shopify_shop_url = Property(str)
    shopify_is_active = Property(bool)
    unltd_ai_api_organization_id = Property(str)
    unltd_ai_api_secret_key = Property(str)
    public_access_restricted = Property(bool)

    scalable_press_api_key = Property(str)

    google_merchant_api_key = Property(str)
    google_merchant_id = Property(str)
    google_product_reviews_feed_enabled = Property(bool)
    google_product_reviews_feed_token = Property(str)

    qr_shop_qr_code = Property(str)

    social_bitchute = Property(str)
    social_discord = Property(str)
    social_facebook = Property(str)
    social_google = Property(str)
    social_instagram = Property(str)
    social_linkedin = Property(str)
    social_rumble = Property(str)
    social_telegram = Property(str)
    social_tiktok = Property(str)
    social_x = Property(str)
    social_youtube = Property(str)
    telegram_chat_id = Property(str)

    ai_context = Property(str)
    internal_use_notes = Property(str)
    internal_use_ai_context = Property(str)

    active_theme = Property(Theme, backref="domain")
    domain_invitations = Property(DomainInvitation, backref='domain')
    company = Property("sdk.python.companies.Company")
    owned_by = company = Property("sdk.python.companies.Company")
    jobs_assignees = Property("sdk.python.users.User")
    accessible_clients = Property("sdk.python.users.User")
    accessible_client_companies = Property("sdk.python.companies.Company")
    logo = Property(File)
    favicon = Property(File)
    seo_domain_pages = Property("sdk.python.seo_domain_pages.SeoDomainPage")
    domain_chat_settings = Property("sdk.python.domain_chat_settings.DomainChatSettings")
    shipment_methods = Property("sdk.python.shipment_methods.ShipmentMethod")
    themes = Property(Theme)
    menus = Property(Menu)

    deployment_online = Property(bool)
    deployment_in_progress = Property(bool)
    deployment_succeeded = Property(bool)
    deployment_message = Property(str)
    deployment_key = Property(str)

    def public_categories(self):
        """ Return domain categories which are public """
        return [category for category in self.categories if
                category.show_public]

    def email_notifications_enabled(self):
        """ Return True if the domain has email notifications switched on """
        return self.enable_notifications and\
            self.enable_email_notifications

    def sms_notifications_enabled(self):
        """ Return True if the domain has SMS notifications switched on """
        return self.enable_notifications and\
            self.enable_sms_notifications

    def main_menu(self):
        """ Return the first menu of menu type MAIN else return None """
        if self.menus:
            for menu in self.menus:
                if menu.menu_type == menu_util.MAIN:
                    return menu
        return None

    def safe_tracking_code_google_conversion(self, invoice=None):
        """ Return javascript conversion code string safe to serve to clients.

            Javascript is 'santised' to remove any unknown parts by simply
            extracting known parameters from the format that a correct
            conversion tracking code is expected to be in, and then
            rerendering it in that format. In the process, any extra code
            gets thrown away.

            If invoice is supplied, it may be used to fill in any missing
            non domain constant details like currency and value.
        """
        code = self.tracking_code_google_conversion
        if code is None or code == '':
            return ''
        script_parameters = \
            extract_tracking_conversion_google_script_parameters(code)
        return reconstitute_tracking_conversion_google_script(
            script_parameters, invoice)

    def safe_tracking_code_google_global(self):
        """ Return javascript tracking code string safe to serve to clients.

            Javascript is 'santised' to remove any unknown parts by simply
            extracting known parameters from the format that a correct
            conversion tracking code is expected to be in, and then
            rerendering it in that format. In the process, any extra code
            gets thrown away.
        """
        code = self.tracking_code_google_global
        if code is None or code == '':
            return ''
        script_parameters = \
            extract_tracking_global_google_script_parameters(code)
        return reconstitute_tracking_global_google_script(script_parameters)

    def logo_url(self):
        """ Return the domain logo if there is one or else return the
            PLATFORM_MASCOT_ICON
        """
        if self.logo:
            return self.logo.view_url
        return PLATFORM_MASCOT_ICON

    def _storefront_request(self, resource, method='GET', data=None,
                            query=None, expected_statuses=(200,), **kwargs):
        if 'skip_rights' not in kwargs:
            kwargs['skip_rights'] = True
        request = sdk.python.entities.generate_request(
            data=data, query=query, **kwargs)
        request.method = method
        request.resource = resource
        response = request.send()
        if response.status_code not in expected_statuses:
            sdk.python.entities.check_response(response, expected_statuses[0])
        return response.json()

    def get_storefront_v2(self, **kwargs):
        """Fetch storefront v2 config for this domain.

        Responses can include active preview branch attributes:
        - `activePreviewBranchName`
        - `activePreviewStartedAt`
        - `activePreviewLastRequestId`
        """
        return self._storefront_request(
            '/domains/{0}/storefront_v2/'.format(self.id),
            method='GET',
            expected_statuses=(200,),
            **kwargs)

    def provision_storefront_v2(self, data=None, **kwargs):
        """Provision storefront v2 resources for this domain.

        `data` may include:
        - `starterTemplate`: starter repo in `owner/repo` format.
        - `urlStructure`: desired product route pattern
          (for example `/products/:product`).
        """
        return self._storefront_request(
            '/domains/{0}/storefront_v2/provision/'.format(self.id),
            method='POST',
            data=data,
            expected_statuses=(200, 201),
            **kwargs)

    def extract_storefront_v2_site_context(self, data=None, **kwargs):
        """Run storefront site-context extraction.

        `data` should include:
        - `url` or `sourceUrl`: target site URL to analyze.

        Responses may include:
        - `analysisFilePath`: markdown analysis document path
        - `analysisJsonFilePath`: structured JSON analysis document path
        - `analysisScreenshotPaths`: saved screenshot artifact paths
        - `analysisScreenshots`: screenshot metadata/context image payloads
        - `emulationSpec`: route contract and boilerplate component mapping
        - `pageAnalysis`: per-page extracted content summaries
        """
        return self._storefront_request(
            '/domains/{0}/storefront_v2/site_context/extract/'.format(self.id),
            method='POST',
            data=data,
            expected_statuses=(200,),
            **kwargs)

    def resolve_starter_template_url_structure(self, data=None, **kwargs):
        """Resolve the default URL structure for a starter template repo.

        `data` should include:
        - `starterTemplate`: starter repo in `owner/repo` format.

        Returns:
        - `starterTemplate`
        - `urlStructure`
        """
        return self._storefront_request(
            '/domains/{0}/storefront_v2/starter_template/url_structure/'.format(self.id),
            method='POST',
            data=data,
            expected_statuses=(200,),
            **kwargs)

    def sync_storefront_v2_environment_variables(self, data=None, **kwargs):
        """Upsert env vars on the linked Vercel project without reprovisioning.

        `data` should include:
        - `environmentVariables`: dict of key/value pairs from the boilerplate schema.

        Returns:
        - `variableCount`
        - `variableKeys`
        - `vercelProjectId`
        """
        return self._storefront_request(
            '/domains/{0}/storefront_v2/environment_variables/'.format(self.id),
            method='POST',
            data=data,
            expected_statuses=(200,),
            **kwargs)

    def create_storefront_v2_generation_brief(self, data=None, **kwargs):
        """Build a generation brief and clarification questions before code generation.

        `data` should include:
        - `siteContext`: extracted site analysis payload.
        - `urlStructure`: optional selected route pattern.
        - `starterTemplate`: optional starter repo identifier.

        Returns payload with:
        - `generationBrief.planSummary`
        - `generationBrief.boilerplateFit`
        - `generationBrief.gapTopics`
        - `generationBrief.questions`
        - `generationBrief.questionCount`
        """
        return self._storefront_request(
            '/domains/{0}/storefront_v2/generation_brief/'.format(self.id),
            method='POST',
            data=data,
            expected_statuses=(200,),
            **kwargs)

    def reset_storefront_v2(self, data=None, **kwargs):
        """Delete the current storefront v2 setup for this domain (admin only)."""
        return self._storefront_request(
            '/domains/{0}/storefront_v2/reset/'.format(self.id),
            method='POST',
            data=data,
            expected_statuses=(200, 201),
            **kwargs)

    def create_storefront_change_request(self, data=None, **kwargs):
        """Create a storefront change request.

        `data` may include:
        - `prompt`: natural language request text.
        - `contextFilePaths`: list of repository file paths to prioritize.
        - `contextImages`: list of image context objects containing
          `name`, optional `mimeType`, and `dataUrl`.
        - `branchName`: reuse an existing preview branch.
        - `startNewBranch`: create a new AI-named preview branch.
        - `clarificationAnswers`: user answers keyed by question id.
        - `generationBriefSummary`: brief summary from generation planning.
        - `generationBoilerplateFit`: boilerplate fit summary from planning.
        - `clarificationSkipped`: bool when user skipped clarification step.
        """
        return self._storefront_request(
            '/domains/{0}/storefront_v2/requests/'.format(self.id),
            method='POST',
            data=data,
            expected_statuses=(200, 201),
            **kwargs)

    def get_storefront_change_request(self, request_id, **kwargs):
        """Fetch a storefront change request.

        The API response may include `pullRequestNumber`, `checksSummary`,
        `checksUpdatedAt`, and `executionEvents` when run/approve workflows
        are using GitHub PRs.
        """
        return self._storefront_request(
            '/storefront_change_requests/{0}/'.format(request_id),
            method='GET',
            expected_statuses=(200,),
            **kwargs)

    def get_storefront_change_request_events(self, request_id, **kwargs):
        """Fetch execution events for a storefront change request.

        Returns payload with:
        - `requestId`: change request id
        - `events`: ordered execution event list
        """
        return self._storefront_request(
            '/storefront_change_requests/{0}/events/'.format(request_id),
            method='GET',
            expected_statuses=(200,),
            **kwargs)

    def run_storefront_change_request(self, request_id, data=None, **kwargs):
        """Run a storefront change request and return updated metadata.

        Successful responses can include `pullRequestNumber`,
        `checksSummary`, and `checksUpdatedAt`.
        """
        return self._storefront_request(
            '/storefront_change_requests/{0}/run/'.format(request_id),
            method='POST',
            data=data,
            expected_statuses=(200, 201),
            **kwargs)

    def approve_storefront_change_request(self, request_id, data=None, **kwargs):
        return self._storefront_request(
            '/storefront_change_requests/{0}/approve/'.format(request_id),
            method='POST',
            data=data,
            expected_statuses=(200, 201),
            **kwargs)

    def reject_storefront_change_request(self, request_id, data=None, **kwargs):
        return self._storefront_request(
            '/storefront_change_requests/{0}/reject/'.format(request_id),
            method='POST',
            data=data,
            expected_statuses=(200, 201),
            **kwargs)

    def get_storefront_v2_deployments(self, **kwargs):
        return self._storefront_request(
            '/domains/{0}/storefront_v2/deployments/'.format(self.id),
            method='GET',
            expected_statuses=(200,),
            **kwargs)

    def get_storefront_v2_deployment_logs(self, deployment_id, **kwargs):
        return self._storefront_request(
            '/domains/{0}/storefront_v2/deployments/{1}/logs/'.format(
                self.id, deployment_id),
            method='GET',
            expected_statuses=(200,),
            **kwargs)

    def rollback_storefront_v2(self, data=None, **kwargs):
        return self._storefront_request(
            '/domains/{0}/storefront_v2/rollback/'.format(self.id),
            method='POST',
            data=data,
            expected_statuses=(200, 201),
            **kwargs)

    def get_storefront_v2_repository_tree(self, query=None, **kwargs):
        """List repository tree entries for a path/ref."""
        return self._storefront_request(
            '/domains/{0}/storefront_v2/repository_tree/'.format(self.id),
            method='GET',
            query=query,
            expected_statuses=(200,),
            **kwargs)

    def get_storefront_v2_repository_branches(self, **kwargs):
        """List repository branches for the storefront repo."""
        return self._storefront_request(
            '/domains/{0}/storefront_v2/repository_branches/'.format(self.id),
            method='GET',
            expected_statuses=(200,),
            **kwargs)

    def get_storefront_v2_repository_file(self, query=None, **kwargs):
        """Fetch repository file contents.

        `query` should include:
        - `path`: repository file path.
        - `ref`: optional branch/ref name.
        """
        return self._storefront_request(
            '/domains/{0}/storefront_v2/repository_file/'.format(self.id),
            method='GET',
            query=query,
            expected_statuses=(200,),
            **kwargs)

    def update_storefront_v2_repository_file(self, data=None, **kwargs):
        """Update repository file contents on a branch.

        `data` should include:
        - `path`: repository file path.
        - `content`: full file content.
        - `message`: optional commit message.
        - `branch`: optional branch name.
        """
        return self._storefront_request(
            '/domains/{0}/storefront_v2/repository_file/'.format(self.id),
            method='POST',
            data=data,
            expected_statuses=(200, 201),
            **kwargs)

    def publish_storefront_v2_product(self, data=None, **kwargs):
        """Publish or recache a product URL on the storefront."""
        return self._storefront_request(
            '/domains/{0}/storefront_v2/products/publish/'.format(self.id),
            method='POST',
            data=data,
            expected_statuses=(200, 201),
            **kwargs)

    def publish_storefront_v2_category(self, data=None, **kwargs):
        """Publish or recache a category URL on the storefront."""
        return self._storefront_request(
            '/domains/{0}/storefront_v2/categories/publish/'.format(self.id),
            method='POST',
            data=data,
            expected_statuses=(200, 201),
            **kwargs)

    def get_analytics(self, **kwargs):
        return self._storefront_request(
            '/domains/{0}/analytics/'.format(self.id),
            method='GET',
            expected_statuses=(200,),
            **kwargs)

    def get_agent_token_analytics(self, query=None, **kwargs):
        return self._storefront_request(
            '/domains/{0}/agent_token_analytics/'.format(self.id),
            query=query,
            method='GET',
            expected_statuses=(200,),
            **kwargs)


class EnrolledDomain(sdk.python.entities.Entity):

    resource = '/enrolled_domains/'
    json_name = 'enrolled_domain'

    id = Property(int)
    role = Property(str)
    domain = Property(Domain)
    is_jobs_assignee = Property(bool)


class Domains(sdk.python.entities.Resource):

    entity_class = Domain
    json_name = 'domains'

    def get_by_name(self, name, api_secret):
        result, _ = self.fetch(query={'name': name},
                               api_secret=api_secret)
        if len(result) == 1:
            return result[0]
        return None


class EnrolledDomains(sdk.python.entities.Resource):

    entity_class = EnrolledDomain
    json_name = 'enrolled_domains'


domains = Domains()
enrolled_domains = EnrolledDomains()
